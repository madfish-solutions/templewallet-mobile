import { BigNumber } from 'bignumber.js';
import { from, of } from 'rxjs';
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

type cachedAssetBalance = {
  time: number;
  value?: string;
};

const cachedResults: Record<string, cachedAssetBalance> = {
  // tz123456_KT1234654645: {time: <timestamp>, value: <balance>}
};

const CACHE_TIME = 1000 * 60; // 1 minute

export const loadAssetBalance$ = (rpcUrl: string, publicKeyHash: string, assetSlug: string) => {
  const tezos = createReadOnlyTezosToolkit(rpcUrl, readOnlySignerAccount);
  const [assetAddress, assetId = '0'] = assetSlug.split('_');

  const cachedRecord = cachedResults[`${publicKeyHash}_${assetSlug}`];

  if (isDefined(cachedRecord) && Date.now() - cachedRecord.time < CACHE_TIME && isDefined(cachedRecord.value)) {
    return of(cachedRecord.value);
  }

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
    map((balance: BigNumber) => {
      const returnValue = balance.isNaN() ? undefined : balance.toFixed();
      cachedResults[`${publicKeyHash}_${assetSlug}`] = {
        time: Date.now(),
        value: returnValue
      };

      return returnValue;
    }),
    catchError(() => {
      return of(undefined);
    })
  );
};
