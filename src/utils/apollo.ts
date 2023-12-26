import { ApolloClient, InMemoryCache, HttpLink, FetchResult, OperationVariables, QueryOptions } from '@apollo/client';
import fetch from 'cross-fetch';
import { DocumentNode } from 'graphql';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

import { isDefined } from './is-defined';

export const buildApolloClient = (uri: string) =>
  new TempleApolloClient({
    link: new HttpLink({ uri, fetch }),
    cache: new InMemoryCache()
  });

class TempleApolloClient<TCacheShape> extends ApolloClient<TCacheShape> {
  async fetch<T, TVars = OperationVariables>(query: DocumentNode, variables?: TVars, options?: QueryOptions<TVars, T>) {
    const result: FetchResult<T> = await super.query<T, TVars>({
      query,
      variables,
      // Disabling cache as it creates bottlenecks (blocks thread) when fetching large data
      fetchPolicy: 'no-cache',
      ...options
    });

    return result.data;
  }

  fetch$<T, TVars = OperationVariables>(query: DocumentNode, variables?: TVars, options?: QueryOptions<TVars, T>) {
    return from(this.fetch<T, TVars>(query, variables, options)).pipe(filter(isDefined));
  }
}
