import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { betterCallDevApi } from '../api.service';
import { GetAccountTokenBalancesResponseInterface } from '../interfaces/get-account-token-balances-response.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { getTokenType } from '../token/utils/token.utils';
import { readOnlySignerAccount } from './read-only.signer.util';
import { createReadOnlyTezosToolkit, CURRENT_NETWORK_ID } from './rpc/tezos-toolkit.utils';

const size = 10;

const getTokenBalances = (accountPublicKeyHash: string, offset: number) =>
  betterCallDevApi.get<GetAccountTokenBalancesResponseInterface>(
    `/account/${CURRENT_NETWORK_ID}/${accountPublicKeyHash}/token_balances`,
    { params: { size, offset } }
  );

export const loadTokensWithBalance$ = (accountPublicKeyHash: string) =>
  from(getTokenBalances(accountPublicKeyHash, 0)).pipe(
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

export const loadTezosBalance$ = (rpcUrl: string, publicKeyHash: string) =>
  from(createReadOnlyTezosToolkit(rpcUrl, readOnlySignerAccount).tz.getBalance(publicKeyHash)).pipe(
    map(balance => balance.toFixed()),
    catchError(() => '0')
  );

const loadAssetBalance$ = (tezos: TezosToolkit, publicKeyHash: string, assetSlug: string) => {
  const [assetAddress, assetId = '0'] = assetSlug.split('_');

  return from(tezos.contract.at(assetAddress)).pipe(
    switchMap(contract => {
      if (getTokenType(contract) === TokenTypeEnum.FA_2) {
        return from(contract.views.balance_of([{ owner: publicKeyHash, token_id: assetId }]).read()).pipe(
          map(response => response[0].balance)
        );
      } else {
        return contract.views.getBalance(publicKeyHash).read();
      }
    }),
    map((balance: BigNumber) => balance.toFixed()),
    catchError(() => '0')
  );
};

export const loadAssetsBalances$ = (rpcUrl: string, publicKeyHash: string, assetSlugs: string[]) =>
  forkJoin(
    assetSlugs.map(assetSlug =>
      loadAssetBalance$(createReadOnlyTezosToolkit(rpcUrl, readOnlySignerAccount), publicKeyHash, assetSlug)
    )
  ).pipe(
    map(balancesList => {
      const balancesRecord: Record<string, string> = {};

      for (let index = 0; index < assetSlugs.length; index++) {
        balancesRecord[assetSlugs[index]] = balancesList[index] ?? '0';
      }

      return balancesRecord;
    })
  );
