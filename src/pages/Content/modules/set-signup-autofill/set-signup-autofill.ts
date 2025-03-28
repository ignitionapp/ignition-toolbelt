import { simulateClick, simulateSelect, simulateType } from './util';
import { Faker, en_AU, en, base } from '@faker-js/faker';
import { AUTOFILL_PAGES, q, waitForElement } from '../../lib';
import { getEnvByUrl } from '../../../Popup/utils';

const faker = new Faker({ locale: [en_AU, en, base] });

const run = async (url: string, shouldClickNext = false) => {
  const results = await chrome.storage.local.get([AUTOFILL_PAGES]);
  const isEnabled = results[AUTOFILL_PAGES] || false;
  if (!isEnabled) return;

  const env = getEnvByUrl(url);
  if (env === 'production') return;

  const { fakerSeedValue } = await chrome.storage.local.get(['fakerSeedValue']);
  faker.seed(fakerSeedValue);

  const { pathname } = new URL(url);
  switch (pathname) {
    case '/sign-up/sso': {
      const submitButtonEl = await waitForElement<HTMLButtonElement>(
        '[data-testid="sign-up-email-button"]'
      );
      if (shouldClickNext && submitButtonEl) {
        simulateClick(submitButtonEl);
      }
      break;
    }

    case '/sign-up/email': {
      const emailEl = await waitForElement<HTMLInputElement>(
        'input[name="email"]'
      );
      if (emailEl) {
        simulateType(emailEl, faker.internet.email());
      }
      const passwordEl = q<HTMLInputElement>('input[name="password"]');
      if (passwordEl) {
        simulateType(passwordEl, faker.internet.password());
      }
      const submitButtonEl = q<HTMLButtonElement>(
        '[data-testid="submit-button"]'
      );
      if (shouldClickNext && submitButtonEl) {
        simulateClick(submitButtonEl);
      }
      break;
    }

    case '/welcome': {
      const fullNameEl = await waitForElement<HTMLInputElement>(
        'input[name="fullName"]'
      );
      if (fullNameEl)
        simulateType(
          fullNameEl,
          `${faker.person.firstName()} ${faker.person.lastName()}`
        );

      const companyNameEl = q<HTMLInputElement>('input[name="companyName"]');
      if (companyNameEl) simulateType(companyNameEl, faker.company.name());

      const phoneNumberEl = q<HTMLInputElement>('input[name="phoneNumber"]');
      if (phoneNumberEl) simulateType(phoneNumberEl, faker.phone.number());

      simulateSelect('.countrySelect', 'Australia');

      const referralMethodEl = q<HTMLInputElement>(
        'input[name="referralMethod"]'
      );
      if (referralMethodEl) simulateType(referralMethodEl, 'Google');

      const nextButtonEl = q<HTMLButtonElement>('[data-testid="next-button"]');
      if (shouldClickNext && nextButtonEl) simulateClick(nextButtonEl);
      break;
    }

    case '/welcome/questions': {
      await waitForElement<HTMLParagraphElement>(
        'p:contains("Tell us about your business")'
      );
      simulateSelect('.industry', 'Accounting');
      simulateSelect('.revenueBracket', '$0-$200K');
      simulateSelect('.ledger', 'Xero');
      simulateSelect('.clientsCount', '2000+ clients');
      simulateSelect('.hasManyRecurringClients', 'No');

      const nextButtonEl = q<HTMLButtonElement>('[data-testid="next-button"]');
      if (shouldClickNext && nextButtonEl) simulateClick(nextButtonEl);
      break;
    }
  }
};

export const setSignupAutofill = async () => {
  chrome.runtime.onMessage.addListener(async ({ type, value, group }) => {
    if (type === AUTOFILL_PAGES && group === 'signup') {
      await run(value);
    }
  });
};
