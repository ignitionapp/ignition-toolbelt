import type { Faker } from '@faker-js/faker';
import { q, simulateClick, simulateSelect, simulateType } from '../../lib';
import { getPostCodeByState, State } from './utils';

export const autofillBusinessOwnerPage = async (
  faker: Faker,
  shouldClickNext: boolean = false
) => {
  const { fakerSeedValue } = await chrome.storage.local.get(['fakerSeedValue']);
  faker.seed(fakerSeedValue);

  const legalFirstName = q<HTMLInputElement>('input[name="first_name"]');
  const legalLastName = q<HTMLInputElement>('input[name="last_name"]');
  if (legalFirstName && legalLastName) {
    simulateType(legalFirstName, faker.person.firstName());
    simulateType(legalLastName, faker.person.lastName());
  }

  const emailAddress = q<HTMLInputElement>('input[name="email"]');
  if (emailAddress) {
    simulateType(emailAddress, faker.internet.email());
  }

  const jobTitle = q<HTMLInputElement>('input[name="relationship[title]"]');
  if (jobTitle) {
    simulateType(jobTitle, faker.person.jobTitle());
  }

  const dayOfBirth = q<HTMLInputElement>('input[placeholder="DD"]');
  const monthOfBirth = q<HTMLInputElement>('input[placeholder="MM"]');
  const yearOfBirth = q<HTMLInputElement>('input[placeholder="YYYY"]');
  if (dayOfBirth && monthOfBirth && yearOfBirth) {
    const dob = faker.date.past({ years: 50, refDate: '2000-1-1' });
    simulateType(dayOfBirth, `0${dob.getDate()}`.slice(-2));
    simulateType(monthOfBirth, `0${dob.getMonth() + 1}`.slice(-2)); // Months are zero-indexed
    simulateType(yearOfBirth, dob.getFullYear().toString());
  }

  const streetAddress = q<HTMLInputElement>('input[data-testid="address1"]');
  const flatUnitOther = q<HTMLInputElement>('input[data-testid="address2"]');
  const city = q<HTMLInputElement>('input[data-testid="locality"]');
  const state = q<HTMLInputElement>('select[data-testid="subregion"]');
  const postalCode = q<HTMLInputElement>('input[data-testid="postal-code"]');
  if (streetAddress && flatUnitOther && city && state && postalCode) {
    simulateType(streetAddress, faker.location.streetAddress());
    simulateType(flatUnitOther, faker.location.secondaryAddress());

    simulateType(city, faker.location.city());
    const selectedState = faker.location.state({ abbreviated: true }) as State;
    simulateSelect('select[data-testid="subregion"]', selectedState);

    simulateType(postalCode, getPostCodeByState(faker, selectedState));
  }

  const phoneNumber = q<HTMLInputElement>('input[type="tel"]');
  if (phoneNumber) {
    simulateType(phoneNumber, faker.helpers.fromRegExp(/041[0-9]{7}/));
  }

  const relationshipOwner = q<HTMLInputElement>(
    'input[name="relationship.owner"]'
  );
  if (relationshipOwner) {
    simulateClick(relationshipOwner);
  }

  const relationshipDirector = q<HTMLInputElement>(
    'input[name="relationship.director"]'
  );
  if (relationshipDirector) {
    simulateClick(relationshipDirector);
  }

  const relationshipPercentOwnership = q<HTMLInputElement>(
    'input[name="relationship[percent_ownership]"]'
  );
  if (relationshipPercentOwnership) {
    simulateType(relationshipPercentOwnership, '100');
  }

  if (shouldClickNext) {
    const nextButton = q('a:contains("Continue")');
    if (nextButton) {
      simulateClick(nextButton);
    }
  }
};
