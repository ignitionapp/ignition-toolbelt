import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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

import { AI_ASSISTANT } from './lib';

const checkTokenValid = async (token: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.status === 200;
  } catch (e) {
    return false;
  }
};

type FormValues = {
  token: string;
};

export const AiAssistantSetting = () => {
  const [isTokenValid, setTokenValid] = useState<boolean | null>(null);
  const { formState, handleSubmit, register, reset, watch } =
    useForm<FormValues>({
      defaultValues: {
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
    chrome.storage.local.get([AI_ASSISTANT]).then((results) => {
      const { token } = results[AI_ASSISTANT] || {
        token: '',
      };
      reset({ token });
    });
  }, [reset]);

  const handleSave = ({ token }: FormValues) => {
    chrome.storage.local.set({
      [AI_ASSISTANT]: {
        token,
      },
    });
    reset({ token });
  };

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <VStack spacing="large">
        <FormControl marginBottom={4}>
          <FormLabel htmlFor="openAiToken">Open AI Token</FormLabel>
          <InputGroup>
            <Input type="password" {...register('token')} />
            <InputRightElement>
              <Text color={isTokenValid ? 'green.500' : 'red.500'}>
                <FontAwesomeIcon
                  icon={isTokenValid ? faCheckCircle : faCircleXmark}
                />
              </Text>
            </InputRightElement>
          </InputGroup>
          <FormHelperText>
            It will be used for accessing Open AI's Chat Completion API. You can
            get your OpenAI token here:{' '}
            <Link
              color="blue.500"
              href="https://platform.openai.com/api-keys"
              isExternal
            >
              OpenAI Token
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
