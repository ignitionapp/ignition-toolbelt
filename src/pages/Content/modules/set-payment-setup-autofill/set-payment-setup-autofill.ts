import { Faker, en_AU, en, base } from '@faker-js/faker';
import {
  AUTOFILL_PAGES,
  q,
  simulateClick,
  simulateType,
  waitForElement,
} from '../../lib';
import 'arrive';
import { getEnvByUrl } from '../../../Popup/utils';

const SUBMIT_BUTTON_SELECTOR = 'button[type="button"]:contains("Submit")';
const BANK_ACCOUNT_NAME_SELECTOR = 'input[name="accountName"]';
const BANK_ROUTING_NUMBER_SELECTOR = 'input[name="routingNumber"]';
const BANK_ACCOUNT_NUMBER_SELECTOR = 'input[name="accountNumber"]';

const faker = new Faker({ locale: [en_AU, en, base] });

const run = async (value: string, shouldClickNext = false) => {
  const results = await chrome.storage.local.get([AUTOFILL_PAGES]);
  const isEnabled = results[AUTOFILL_PAGES] || false;
  if (!isEnabled) return;

  const env = getEnvByUrl(value);
  if (env === 'production') return;

  const { fakerSeedValue } = await chrome.storage.local.get(['fakerSeedValue']);
  faker.seed(fakerSeedValue);

  const bankAccountName = await q<HTMLInputElement>(
    BANK_ACCOUNT_NAME_SELECTOR
  );
  if (bankAccountName && !bankAccountName.value)
    simulateType(bankAccountName, faker.finance.accountName());

  const bankRoutingNumber = q<HTMLInputElement>(BANK_ROUTING_NUMBER_SELECTOR);
  if (bankRoutingNumber && !bankRoutingNumber.value) simulateType(bankRoutingNumber, '110000000');

  const bankAccountNumber = q<HTMLInputElement>(BANK_ACCOUNT_NUMBER_SELECTOR);
  if (bankAccountNumber && !bankAccountNumber.value) simulateType(bankAccountNumber, '000123456');

  const submitButton = await waitForElement(SUBMIT_BUTTON_SELECTOR);
  if (shouldClickNext && submitButton) {
    simulateClick(submitButton);
  }
};

export const setPaymentSetupAutofill = () => {
  chrome.runtime.onMessage.addListener(({ type, value, group }) => {
    if (type !== AUTOFILL_PAGES || group !== 'payment') {
      return;
    }

    // @ts-ignore
    document.arrive('[name="accountName"]', () => run(value));
  });
};
