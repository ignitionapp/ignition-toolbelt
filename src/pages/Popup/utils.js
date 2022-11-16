import { ApolloClient, InMemoryCache } from '@apollo/client';

export const createApolloClient = ({ hostUrl, accessToken }) =>
  new ApolloClient({
    uri: `${hostUrl}/graphql`,
    cache: new InMemoryCache(),
    headers: { Authorization: `Bearer ${accessToken}` },
  });

export const getHostUrl = (url) => {
  if (url.includes('https://demo.ignitionapp.com')) {
    return 'https://demo.ignitionapp.com';
  }

  if (url.includes('http://localhost:3000')) {
    return 'http://localhost:3000';
  }

  if (url.includes('https://go.ignitionapp.com')) {
    return 'https://go.ignitionapp.com';
  }

  return null;
};

export const getEnvByUrl = (url) => {
  if (url.includes('https://demo.ignitionapp.com')) {
    return 'demo';
  }

  if (url.includes('http://localhost:3000')) {
    return 'local';
  }

  if (url.includes('https://go.ignitionapp.com')) {
    return 'production';
  }

  return null;
};
