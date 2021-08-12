import { forkJoin, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { balancesApi, betterCallDevApi } from '../api.service';
import { GetAccountTokenBalancesResponseInterface } from '../interfaces/get-account-token-balances-response.interface';
import { TokenBalanceInterface } from '../token/interfaces/token-balance.interface';
import { getTokenSlug } from '../token/utils/token.utils';

const size = 10;

const getTokenBalances = (currentNetworkId: string, accountPublicKeyHash: string, offset: number) =>
  betterCallDevApi.get<GetAccountTokenBalancesResponseInterface>(
    `/account/${currentNetworkId}/${accountPublicKeyHash}/token_balances`,
    { params: { size, offset } }
  );

export const loadTokensWithBalance$ = (currentNetworkId: string, accountPublicKeyHash: string) => {
  return from(getTokenBalances(currentNetworkId, accountPublicKeyHash, 0)).pipe(
    switchMap(initialResponse => {
      if (initialResponse.data.total > size) {
        const numberOfAdditionalRequests = Math.floor(initialResponse.data.total / size);

        return forkJoin(
          new Array(numberOfAdditionalRequests).map((_, i) =>
            getTokenBalances(currentNetworkId, accountPublicKeyHash, (i + 1) * size)
          )
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

export const loadTokensBalances$ = (accountPublicKeyHash: string, tokensWithBalance: TokenBalanceInterface[]) =>
  from(
    balancesApi.post<Record<string, string>>('/', {
      account: accountPublicKeyHash,
      assetSlugs: tokensWithBalance.map(tokenWithBalance =>
        getTokenSlug({
          address: tokenWithBalance.contract,
          id: tokenWithBalance.token_id
        })
      )
    })
  ).pipe(map(response => response.data));
