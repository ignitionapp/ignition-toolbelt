import {
  Button,
  FormControl,
  FormLabel,
  Flex,
  Input,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

// @ts-ignore
import logo from '../../assets/img/logo.svg';

export const Login = ({
  onSignIn,
}: {
  onSignIn(accessToken: string): void;
}) => {
  const email = window.localStorage.getItem('email') || 'lala@teletubbies.com';
  const password = window.localStorage.getItem('password') || 'Zaq12345^&*()';
  const { formState, handleSubmit, register } = useForm({
    defaultValues: { email, password },
  });

  // @ts-ignore
  const handleSignIn = (values) => {
    onSignIn('');
  };

  return (
    <Flex
      alignItems="center"
      as="form"
      position="absolute"
      flexDirection="column"
      height="100%"
      justifyContent="center"
      width="100%"
      onSubmit={handleSubmit(handleSignIn)}
    >
      <Stack spacing="50px" p="50px">
        <img src={logo} className="App-logo" alt="logo" />
        <Stack spacing="25px">
          <FormControl isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="Enter your email address"
              type="email"
              {...register('email')}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="Enter password"
              type="password"
              {...register('password')}
            />
          </FormControl>
        </Stack>
        <Button
          colorScheme="purple"
          size="lg"
          type="submit"
          isDisabled={!formState.isValid}
        >
          Login
        </Button>
      </Stack>
    </Flex>
  );
};