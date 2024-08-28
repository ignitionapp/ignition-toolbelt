import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Link,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';

import { GITHUB_AUTOFILL_SETTING } from './lib';

const checkTokenValid = async (token: string) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const scopes = response.headers.get('x-oauth-scopes');
    if (response.status !== 200 || !scopes) {
      return false;
    }

    const tokenScopes = scopes.split(', ').map((scope) => scope.trim());
    return ['repo', 'user'].every((scope) => tokenScopes.includes(scope));
  } catch (e) {
    return false;
  }
};

const availableReviewers = [
  { label: 'Andrei Railean', value: 'AndreiRailean' },
  { label: 'Aleks Milosev', value: 'aleksandarmilosev' },
  { label: 'Bill Tran', value: 'BillTmn' },
  { label: 'Bill Mansfield', value: 'bill-mansfield' },
  { label: 'Corinne Brady', value: 'corinnebrady' },
  { label: 'Chris Nelson', value: 'chrisrbnelson' },
  { label: 'Daniel Norman', value: 'danielcnorman' },
  { label: 'David Dinh', value: 'pi-ddinh' },
  { label: 'David Evans', value: 'davidevans-syd' },
  { label: 'David Smith', value: 'djs070' },
  { label: 'Dylan McKay', value: 'brassdylan' },
  { label: 'Emily Pasiak', value: 'pasiemignite' },
  { label: 'Gergely Karolyi', value: 'gkarolyi' },
  { label: 'Gareth Robinson', value: 'mehwoot' },
  { label: 'Ian Lenehan', value: 'ianlenehan' },
  { label: 'James Huang', value: 'james1239090' },
  { label: 'Jasmine', value: 'jasoji-ign' },
  { label: 'Joey Chen', value: 'joyfeel' },
  { label: 'Joseph Chiang', value: 'josephj' },
  { label: 'Jun Huang', value: 'iknowu10' },
  { label: 'Keith Rowell', value: 'keithrowell' },
  { label: 'Louie Esteban', value: 'wizardofosmium' },
  { label: 'Nick Dainty', value: 'nickpad' },
  { label: 'Moe Foster', value: 'Moeface' },
  { label: 'Ramil Mustafin', value: 'rmustafin' },
  { label: 'Stephan Slehta', value: 'StefanSlheta' },
  { label: 'Scott Arbeitman', value: 'friendofasquid' },
  { label: 'Tony Breckner', value: 'abreckner' },
  { label: 'Vikas Saroha', value: 'pi-vikassaroha' },
  { label: 'Walid Halabi', value: 'walidhalabi' },
  { label: 'Zillah Chen', value: 'zillahchen' },
];

const availableLabels = [
  { label: 'eng-backend', value: 'eng-backend' },
  { label: 'eng-frontend', value: 'eng-frontend' },
  { label: 'eng-team-interstellar', value: 'eng-team-interstellar' },
  { label: 'eng-team-nebula', value: 'eng-team-nebula' },
  { label: 'eng-team-orion', value: 'eng-team-orion' },
  { label: 'eng-team-rocket', value: 'eng-team-rocket' },
  { label: 'dev-ops', value: 'dev-ops' },
  { label: 'review-app', value: 'review-app' },
];

type FormValues = {
  reviewers: string[];
  labels: string[];
  token: string;
};

export const GithubAutofillSetting = () => {
  const [isTokenValid, setTokenValid] = useState<boolean | null>(null);
  const { formState, control, handleSubmit, register, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
        reviewers: [],
        labels: [],
        token: '',
      },
    });

  const { isDirty, isLoading } = formState;
  const [token] = watch(['token']);

  useEffect(() => {
    if (token) {
      checkTokenValid(token).then((isValid) => setTokenValid(isValid));
    }
  }, [setTokenValid, token]);

  useEffect(() => {
    chrome.storage.local.get([GITHUB_AUTOFILL_SETTING]).then((results) => {
      const { reviewers, labels, token } = results[GITHUB_AUTOFILL_SETTING] || {
        reviewers: [],
        labels: [],
        token: '',
      };
      reset({ reviewers, labels, token });
    });
  }, [reset]);

  const handleSave = ({ token, labels, reviewers }: FormValues) => {
    chrome.storage.local.set({
      [GITHUB_AUTOFILL_SETTING]: {
        labels,
        reviewers,
        token,
      },
    });
    reset({ reviewers, labels, token });
  };

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <VStack spacing="large">
        <FormControl>
          <FormLabel>Reviewers</FormLabel>
          <Controller
            name="reviewers"
            control={control}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <CreatableSelect
                isClearable
                isMulti={true}
                name={name}
                onBlur={onBlur}
                onChange={(options) => {
                  const values = options.map(({ value }) => value);
                  onChange(values);
                }}
                options={availableReviewers}
                value={(value as string[]).map((val) => ({
                  value: val,
                  label: val,
                }))}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Labels</FormLabel>
          <Controller
            name="labels"
            control={control}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <CreatableSelect
                isClearable
                isMulti={true}
                name={name}
                onBlur={onBlur}
                onChange={(options) => {
                  const values = options.map(({ value }) => value);
                  onChange(values);
                }}
                options={availableLabels}
                value={(value as string[]).map((val) => ({
                  value: val,
                  label: val,
                }))}
              />
            )}
          />
        </FormControl>
        <FormControl marginBottom={4}>
          <FormLabel htmlFor="githubToken">GitHub Token</FormLabel>
          <InputGroup>
            <Input type="password" {...register('token')} />
            {token.length > 0 ? (
              <InputRightElement>
                <Text color={isTokenValid ? 'green.500' : 'red.500'}>
                  <FontAwesomeIcon
                    icon={isTokenValid ? faCheckCircle : faCircleXmark}
                  />
                </Text>
              </InputRightElement>
            ) : null}
          </InputGroup>
          <FormHelperText>
            It will be used for fetching your PR details. You can get your
            Github token here:{' '}
            <Link
              color="blue.500"
              href="https://github.com/settings/tokens/new"
              isExternal
            >
              Github Token
            </Link>
          </FormHelperText>
        </FormControl>
        <Button
          type="submit"
          colorScheme="brand"
          isDisabled={!isDirty}
          isLoading={isLoading}
        >
          Save
        </Button>
      </VStack>
    </form>
  );
};
