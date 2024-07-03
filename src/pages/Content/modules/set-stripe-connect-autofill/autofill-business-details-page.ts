import {
  q,
  simulateClick,
  simulateSelect,
  simulateType,
  waitForElement,
} from '../../lib';
import type { Faker } from '@faker-js/faker';
import { getPostCodeByState, State } from './utils';

function generateFakeABN(/*faker: Faker*/) {
  return '11212332356';
  // const prefix = faker.number.int({ min: 10, max: 19 }).toString();
  // const body = faker.datatype
  //   .number({ min: 100000000, max: 199999999 })
  //   .toString();
  // return `${prefix}${body}`;
}

export const autofillBusinessDetailsPage = async (
  faker: Faker,
  shouldClickNext: boolean = false
) => {
  const { fakerSeedValue } = await chrome.storage.local.get(['fakerSeedValue']);
  faker.seed(fakerSeedValue);

  const companyName = faker.company.name();

  const companyNameField = q<HTMLInputElement>('input[name="company[name]"]');
  if (companyNameField) {
    simulateType(companyNameField, companyName);
  }

  const companyTaxId = q<HTMLInputElement>('input[name="company[tax_id]"]');
  if (companyTaxId) {
    simulateType(companyTaxId, generateFakeABN(faker));
  }

  const doingBusinessAs = q<HTMLInputElement>(
    'input[name="business_profile[name]"]'
  );
  if (doingBusinessAs) {
    simulateType(doingBusinessAs, companyName);
  }

  const streetAddress = q<HTMLInputElement>('input[data-testid="address1"]');
  if (streetAddress) {
    simulateType(streetAddress, faker.location.streetAddress());
  }

  const flatUnit = q<HTMLInputElement>('input[data-testid="address2"]');
  if (flatUnit) {
    simulateType(flatUnit, faker.location.secondaryAddress());
  }

  const city = q<HTMLInputElement>('input[data-testid="locality"]');
  if (city) {
    simulateType(city, faker.location.city());
  }

  const state = q('select[data-testid="subregion"]');
  const selectedState = faker.location.state({ abbreviated: true }) as State;
  if (state) {
    simulateSelect('select[data-testid="subregion"]', selectedState);
  }

  const postalCode = q<HTMLInputElement>('input[data-testid="postal-code"]');
  if (postalCode) {
    simulateType(postalCode, getPostCodeByState(faker, selectedState));
  }

  const phoneNumber = q<HTMLInputElement>('input[type="tel"]');
  if (phoneNumber) {
    simulateType(phoneNumber, faker.helpers.fromRegExp(/041[0-9]{7}/));
  }

  const businessWebsite = q<HTMLInputElement>(
    'input[name="business_profile[url]"]'
  );
  if (businessWebsite) {
    simulateType(businessWebsite, faker.internet.url());
  }

  const industry = q('a[data-testid="searchable-select-button"]');
  if (industry) {
    simulateClick(industry);
  }

  const el = await waitForElement(
    'a[data-testid="searchable-select-button"]:contains("Accounting")'
  );

  if (el && shouldClickNext) {
    const nextButton = q('a:contains("Continue")');
    if (nextButton) {
      simulateClick(nextButton);
    }
  }
};
