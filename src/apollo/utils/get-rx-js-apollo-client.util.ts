import { ApolloClient, FetchResult } from '@apollo/client';
import { DocumentNode } from 'graphql';
import { from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export const getRxJSApolloClient = <TCacheShape>(client: ApolloClient<TCacheShape>) => {
  const queryFn = <T, TVars = object>(query: DocumentNode, variables?: TVars, options?: TVars) =>
    from(client.query<T, TVars>({ query, variables, fetchPolicy: 'network-only', ...options })).pipe(
      map((result: FetchResult<T>) => result.data),
      filter((data: T | null | undefined): data is T => data !== null && data !== undefined)
    );

  return {
    query: queryFn
  };
};
