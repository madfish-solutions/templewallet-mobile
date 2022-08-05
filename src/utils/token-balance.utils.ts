import { BigNumber } from 'bignumber.js';
import { forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { getTzktApi } from '../api.service';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { TzktAccountTokenBalance } from '../interfaces/tzkt.interface';
import { getTokenType } from '../token/utils/token.utils';
import { isDefined } from './is-defined';
import { readOnlySignerAccount } from './read-only.signer.util';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';

const TEZOS_DOMAINS_NAME_REGISTRY_ADDRESS = 'KT1GBZmSxmnKJXGMdMLbugPfLyUPmuLSMwKS';

const limit = 300;

const getTokenBalances = (account: string, isCollectible: boolean, selectedRpcUrl: string) =>
  getTzktApi(selectedRpcUrl).get<Array<TzktAccountTokenBalance>>('/tokens/balances', {
    params: {
      account,
      'token.metadata.artifactUri.null': !isCollectible,
      'token.contract.ne': TEZOS_DOMAINS_NAME_REGISTRY_ADDRESS,
      'sort.desc': 'balance',
      limit
    }
  });

export const loadTokensWithBalance$ = (accountPublicKeyHash: string, selectedRpcUrl: string) =>
  forkJoin([
    getTokenBalances(accountPublicKeyHash, false, selectedRpcUrl),
    getTokenBalances(accountPublicKeyHash, true, selectedRpcUrl)
  ]).pipe(map(responses => responses.map(response => response.data).flat()));

export const loadTezosBalance$ = (rpcUrl: string, publicKeyHash: string) =>
  from(createReadOnlyTezosToolkit(rpcUrl, readOnlySignerAccount).tz.getBalance(publicKeyHash)).pipe(
    map(balance => balance.toFixed())
  );

type cachedAssetBalance = {
  time: number;
  value?: string;
};

const cachedResults: Record<string, cachedAssetBalance> = {};

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
