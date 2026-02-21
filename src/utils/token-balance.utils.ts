import BigNumber from 'bignumber.js';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { getTzktApi } from 'src/api.service';
import { ContractType } from 'src/interfaces/contract.type';
import { TokenTypeEnum } from 'src/interfaces/token-type.enum';
import { getTokenType, toTokenSlug } from 'src/token/utils/token.utils';

import { sendErrorAnalyticsEvent } from './analytics/analytics.util';
import { UserAnalyticsCredentials } from './error-analytics-data.utils';
import { isDefined } from './is-defined';
import { readOnlySignerAccount } from './read-only.signer.util';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';

const TEZOS_DOMAINS_NAME_REGISTRY_ADDRESS = 'KT1GBZmSxmnKJXGMdMLbugPfLyUPmuLSMwKS';

/** TZKT API max items limit */
const LIMIT = 10000;

export const fetchAllAssetsBalancesFromTzkt = async (selectedRpcUrl: string, account: string) => {
  const balances: StringRecord = {};

  await (async function recourse(offset: number) {
    const { data } = await fetchAssetsBalancesFromTzktOnce(selectedRpcUrl, account, offset);

    for (const [address, tokenId, balance] of data) {
      const slug = toTokenSlug(address, tokenId);
      balances[slug] = balance;
    }

    if (data.length === LIMIT) {
      await recourse(offset + LIMIT);
    }
  })(0);

  return balances;
};

type AssetBalance = [address: string, tokenId: string, balance: string];

const fetchAssetsBalancesFromTzktOnce = (selectedRpcUrl: string, account: string, offset = 0) =>
  getTzktApi(selectedRpcUrl).get<AssetBalance[]>('/tokens/balances', {
    params: {
      account,
      'token.contract.ne': TEZOS_DOMAINS_NAME_REGISTRY_ADDRESS,
      'select.values': 'token.contract.address,token.tokenId,balance',
      limit: LIMIT,
      offset
    }
  });

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

export const getBalance = async (
  contract: ContractType,
  owner: string,
  tokenId?: number | string | undefined
): Promise<BigNumber> => {
  if (getTokenType(contract) === TokenTypeEnum.FA_2) {
    return (await contract.views.balance_of([{ owner, token_id: tokenId }]).read())[0].balance;
  } else {
    return await contract.views.getBalance(owner).read();
  }
};

export const loadAssetBalance$ = (
  rpcUrl: string,
  publicKeyHash: string,
  assetSlug: string,
  { isAnalyticsEnabled, userId, ABTestingCategory }: UserAnalyticsCredentials
) => {
  const tezos = createReadOnlyTezosToolkit(rpcUrl, readOnlySignerAccount);
  const [assetAddress, assetId = '0'] = assetSlug.split('_');

  const cachedRecord = cachedResults[`${publicKeyHash}_${assetSlug}`];

  if (isDefined(cachedRecord) && Date.now() - cachedRecord.time < CACHE_TIME && isDefined(cachedRecord.value)) {
    return of(cachedRecord.value);
  }

  return from(tezos.contract.at(assetAddress)).pipe(
    switchMap(contract => getBalance(contract, publicKeyHash, assetId)),
    map((balance: BigNumber) => {
      const returnValue = balance.isNaN() ? undefined : balance.toFixed();
      cachedResults[`${publicKeyHash}_${assetSlug}`] = {
        time: Date.now(),
        value: returnValue
      };

      return returnValue;
    }),
    catchError(error => {
      if (isAnalyticsEnabled) {
        sendErrorAnalyticsEvent(
          'LoadAssetBalanceError',
          error,
          [publicKeyHash],
          { userId, ABTestingCategory },
          { rpcUrl, assetSlug }
        );
      }

      return of(undefined);
    })
  );
};
