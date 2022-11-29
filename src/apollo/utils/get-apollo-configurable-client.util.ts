import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

import { getRxJSApolloClient } from './get-rx-js-apollo-client.util';

export const getApolloConfigurableClient = (uri: string) => {
  const apolloClient = new ApolloClient({
    link: new HttpLink({ uri, fetch }),
    cache: new InMemoryCache()
  });

  return getRxJSApolloClient(apolloClient);
};
