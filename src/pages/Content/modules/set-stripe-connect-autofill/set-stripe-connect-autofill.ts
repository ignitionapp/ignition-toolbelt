import { en_AU, en, base, Faker } from '@faker-js/faker';
import {
  AUTOFILL_PAGES,
  simulateClick,
  simulateType,
  waitForElement,
} from '../../lib';
import { autofillAboutBusinessPage } from './autofill-about-business-page';
import { autofillBusinessDetailsPage } from './autofill-business-details-page';
import { autofillBusinessOwnerPage } from './autofill-business-owner-page';
import 'arrive';

const faker = new Faker({ locale: [en_AU, en, base] });

const run = async (shouldClickNext = false) => {
  const results = await chrome.storage.local.get([AUTOFILL_PAGES]);
  const isEnabled = results[AUTOFILL_PAGES];
  if (!isEnabled) return;

  const { fakerSeedValue } = await chrome.storage.local.get(['fakerSeedValue']);
  faker.seed(fakerSeedValue);

  const heading = await waitForElement('h1');
  if (!heading || !heading.textContent) return;

  const title = heading.textContent;
  switch (title) {
    case 'About your business':
      await autofillAboutBusinessPage(shouldClickNext);
      return;
    case 'Tell us about your business':
      await autofillBusinessDetailsPage(faker, shouldClickNext);
      return;
    case 'Verify you represent this business':
      await autofillBusinessOwnerPage(faker, shouldClickNext);
      return;
    default:
      if (title.includes('ID verification for ')) {
        const button = await waitForElement(
          'a[data-test="test-mode-fill-button"]'
        );
        if (shouldClickNext && button) {
          simulateClick(button);
        }
      }

      if (shouldClickNext && title.includes('Review and submit')) {
        const button = await waitForElement(
          'a[data-testid="requirements-index-done-button"]'
        );
        if (button) {
          simulateClick(button);
        }
      }
  }
};

export const setStripeConnectAutofill = () => {
  chrome.runtime.onMessage.addListener(async ({ type, value, group }) => {
    if (type !== AUTOFILL_PAGES || group !== 'stripe') {
      return;
    }

    if (value === 'main') {
      // @ts-ignore
      document.arrive(
        'div[data-testid="account-onboarding-container"] h1',
        () => run()
      );
    }

    if (value === 'accessory') {
      const searchInput = await waitForElement<HTMLInputElement>(
        '[data-testid="searchable-select-input"]'
      );

      if (searchInput) {
        simulateType(searchInput, 'Accountant');
        const keydownEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
        });
        searchInput.dispatchEvent(keydownEvent);
      }
    }
  });
};
