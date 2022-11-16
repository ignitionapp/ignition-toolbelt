import React, { useMemo, useState } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
} from '@apollo/client';

import { AppStatus } from './AppStatus';

import { Content } from './Content';
import { Login } from './Login';
import { createApolloClient } from './utils';

const MUTATION_USER_LOGIN = gql`
  mutation userLogin($email: EmailAddress!, $password: String!) {
    userLogin(input: { email: $email, password: $password }) {
      accessToken
      oneTimePasswordRequired
      mfaInfo {
        id
        enabled
        readyForSetup
        setupSkippable
        setupRequiredFrom
        sources {
          deliveryMethod
        }
      }
    }
  }
`;

const authClient = new ApolloClient({
  uri: 'http://localhost:3000/auth-api/graphql',
  cache: new InMemoryCache(),
});

const userLogin = async ({ email, password }) => {
  const { data } = await authClient.mutate({
    mutation: MUTATION_USER_LOGIN,
    variables: { email, password },
  });

  return data.userLogin;
};

export const Popup = () => {
  const [token, setToken] = useState(window.localStorage.getItem('accessToken'));

  const apolloClient = useMemo(
    () =>
      token ? createApolloClient({
        hostUrl: 'http://localhost:3000',
        accessToken: token,
      }) : undefined,
    [token]
  );

  const handleLogin = async ({ email, password }) => {
    const { accessToken } = await userLogin({ email, password });
    window.localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
  };

  const handleSignIn = async (accessToken) => {
    window.localStorage.setItem('accessToken', accessToken);
    setToken(accessToken);
  }

  return !apolloClient ? (
    <Login onSubmit={handleLogin} />
  ) : (
    <ApolloProvider client={apolloClient}>
      <Content onSignIn={handleSignIn}/>
      <AppStatus />
    </ApolloProvider>
  );
};

/**
 * import React from 'react';
 * import { render } from 'react-dom';
 * import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
 * import { Button, ChakraProvider, Flex, Stack, Text } from '@chakra-ui/react';
 * import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 * import { faGem } from '@fortawesome/free-solid-svg-icons';
 *
 * import Popup from './Popup';
 * import './index.css';
 * import logo from '../../assets/img/logo.svg';
 *
 * const getHostUrl = (url) => {
 *   if (url.includes('https://demo.ignitionapp.com')) {
 *     return 'https://demo.ignitionapp.com';
 *   }
 *
 *   if (url.includes('http://localhost:3000')) {
 *     return 'http://localhost:3000';
 *   }
 *
 *   if (url.includes('https://go.ignitionapp.com')) {
 *     return 'https://go.ignitionapp.com';
 *   }
 *
 *   return null;
 * };
 *
 * (async () => {
 *   const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
 *   const tabUrl = tabs[0].url;
 *   const hostUrl = getHostUrl(tabUrl);
 *   const rootEl = window.document.querySelector('#app-container');
 *
 *   const handleRedirect = (env) => () => {
 *     switch (env) {
 *       case 'production':
 *         chrome.tabs.update({ url: 'https://go.ignitionapp.com' });
 *         break;
 *       case 'demo':
 *         chrome.tabs.update({ url: 'https://demo.ignitionapp.com' });
 *         break;
 *       case 'dev':
 *         chrome.tabs.update({ url: 'http://localhost:3000' });
 *         break;
 *     }
 *     // window.location.reload();
 *     // chrome.runtime.reload()
 *   };
 *
 *   if (!hostUrl) {
 *     render(
 *       <ChakraProvider>
 *         <Flex
 *           alignItems="center"
 *           position="absolute"
 *           flexDirection="center"
 *           height="100%"
 *           justifyContent="center"
 *           width="100%"
 *         >
 *           <Stack spacing="24px" p="50px">
 *             <img src={logo} className="App-logo" alt="logo" />
 *             <Stack>
 *               <Button
 *                 colorScheme="purple"
 *                 onClick={handleRedirect('dev')}
 *                 size="lg"
 *               >
 *                 <FontAwesomeIcon icon={faGem} />{' '}
 *                 <Text fontSize="16px" ml="5px">
 *                   Launch Ignition App
 *                 </Text>
 *               </Button>
 *             </Stack>
 *           </Stack>
 *         </Flex>
 *       </ChakraProvider>,
 *       rootEl
 *     );
 *     return;
 *   }
 *
 *   // const { value: sessionId } = await chrome.cookies.get({
 *   //   url: hostUrl,
 *   //   name: '_session_id',
 *   // });
 *   // console.log("-> sessionId", sessionId);
 *   //
 *   // await chrome.cookies.set({
 *   //   url: 'http://localhost:3000',
 *   //   name: '_session_id',
 *   //   value: sessionId,
 *   // });
 *
 *   const { value: csrfToken } = await chrome.cookies.get({
 *     url: hostUrl,
 *     name: 'csrf_token',
 *   });
 *   console.log('-> csrfToken', csrfToken);
 *
 *   const client = new ApolloClient({
 *     uri: `${hostUrl}/graphql`,
 *     cache: new InMemoryCache(),
 *     headers: { 'X-CSRF-Token': csrfToken },
 *   });
 *
 *   render(
 *     <ApolloProvider client={client}>
 *       <Popup />
 *     </ApolloProvider>,
 *     rootEl
 *   );
 * })();
 *
 * if (module.hot) module.hot.accept();
 */