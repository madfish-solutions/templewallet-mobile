import { ApolloClient, InMemoryCache } from '@apollo/client';

import { getRxJSApolloClient } from './get-rx-js-apollo-client.util';

export const getApolloConfigurableClient = (uri: string) => {
  const apolloClient = new ApolloClient({
    uri,
    cache: new InMemoryCache()
  });

  return getRxJSApolloClient(apolloClient);
};
