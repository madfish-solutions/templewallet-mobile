import { forkJoin, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { balancesApi, betterCallDevApi } from '../api.service';
import { GetAccountTokenBalancesResponseInterface } from '../interfaces/get-account-token-balances-response.interface';
import { CURRENT_NETWORK_ID } from './network/tezos-toolkit.utils';

const size = 10;

const getTokenBalances = (accountPublicKeyHash: string, offset: number) =>
  betterCallDevApi.get<GetAccountTokenBalancesResponseInterface>(
    `/account/${CURRENT_NETWORK_ID}/${accountPublicKeyHash}/token_balances`,
    { params: { size, offset } }
  );

export const loadTokensWithBalance$ = (accountPublicKeyHash: string) => {
  return from(getTokenBalances(accountPublicKeyHash, 0)).pipe(
    switchMap(initialResponse => {
      if (initialResponse.data.total > size) {
        const numberOfAdditionalRequests = Math.floor(initialResponse.data.total / size);

        return forkJoin(
          new Array(numberOfAdditionalRequests)
            .fill(0)
            .map((_, index) => getTokenBalances(accountPublicKeyHash, (index + 1) * size))
        ).pipe(
          map(restResponses => [
            ...initialResponse.data.balances,
            ...restResponses.map(restResponse => restResponse.data.balances).flat()
          ])
        );
      } else {
        return of(initialResponse.data.balances);
      }
    })
  );
};

export const loadTokensBalances$ = (account: string, assetSlugs: string[]) =>
  from(
    balancesApi.post<Array<string>>('/', {
      account,
      assetSlugs
    })
  ).pipe(
    map(response => response.data),
    map(balancesList => {
      const balancesRecord: Record<string, string> = {};

      for (let index = 0; index < assetSlugs.length; index++) {
        balancesRecord[assetSlugs[index]] = balancesList[index] ?? '0';
      }

      return balancesRecord;
    })
  );
