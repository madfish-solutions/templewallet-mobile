import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { tzktApi } from '../api.service';
import { GetAccountTokenBalancesResponseInterface } from '../interfaces/get-account-token-balances-response.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { getTokenType } from '../token/utils/token.utils';
import { isDefined } from './is-defined';
import { readOnlySignerAccount } from './read-only.signer.util';
import { createReadOnlyTezosToolkit, CURRENT_NETWORK_ID } from './rpc/tezos-toolkit.utils';

const size = 1000; // tzkt update: no total count of pages, but maximum limit is increased to 10k

const getTokenBalances = (accountPublicKeyHash: string, offset: number) =>
  tzktApi.get<GetAccountTokenBalancesResponseInterface>(
    `/account/${CURRENT_NETWORK_ID}/${accountPublicKeyHash}/token_balances`,
    {
      params: { limit: size, offset, account: accountPublicKeyHash }
    }
  );

export const loadTokensWithBalance$ = (accountPublicKeyHash: string) =>
  from(getTokenBalances(accountPublicKeyHash, 0)).pipe(
    // TODO: re-implement pagination with abscence of total in new API
    switchMap(initialResponse => of(initialResponse.data))
  );

export const loadTezosBalance$ = (rpcUrl: string, publicKeyHash: string) =>
  from(createReadOnlyTezosToolkit(rpcUrl, readOnlySignerAccount).tz.getBalance(publicKeyHash)).pipe(
    map(balance => balance.toFixed())
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
    map((balance: BigNumber) => (balance.isNaN() ? undefined : balance.toFixed())),
    catchError(() => of(undefined))
  );
};

export const loadAssetsBalances$ = (rpcUrl: string, publicKeyHash: string, assetSlugs: string[]) =>
  forkJoin(
    assetSlugs.map(assetSlug =>
      loadAssetBalance$(createReadOnlyTezosToolkit(rpcUrl, readOnlySignerAccount), publicKeyHash, assetSlug)
    )
  ).pipe(
    map((balancesList: (string | undefined)[]) => {
      const balancesRecord: Record<string, string> = {};

      for (let index = 0; index < assetSlugs.length; index++) {
        const balance = balancesList[index];

        if (isDefined(balance)) {
          balancesRecord[assetSlugs[index]] = balance;
        }
      }

      return balancesRecord;
    })
  );
