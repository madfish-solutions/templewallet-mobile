import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { tzktApi } from '../api.service';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { TzktAccountTokenBalance } from '../interfaces/tzkt.interface';
import { getTokenType } from '../token/utils/token.utils';
import { isDefined } from './is-defined';
import { readOnlySignerAccount } from './read-only.signer.util';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';

const limit = 10000;

const getTokenBalances = (account: string) =>
  tzktApi.get<Array<TzktAccountTokenBalance>>('/tokens/balances', {
    params: { limit, account }
  });

export const loadTokensWithBalance$ = (accountPublicKeyHash: string) =>
  from(getTokenBalances(accountPublicKeyHash)).pipe(
    map(initialResponse => {
      return initialResponse.data;
    })
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
