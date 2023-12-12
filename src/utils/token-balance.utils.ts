import { BigNumber } from 'bignumber.js';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { getTzktApi } from 'src/api.service';
import { ContractType } from 'src/interfaces/contract.type';
import { TokenTypeEnum } from 'src/interfaces/token-type.enum';
import { TzktAccountTokenBalance } from 'src/interfaces/tzkt.interface';
import { getTokenSlug, getTokenType } from 'src/token/utils/token.utils';

import { isDefined } from './is-defined';
import { readOnlySignerAccount } from './read-only.signer.util';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';

const TEZOS_DOMAINS_NAME_REGISTRY_ADDRESS = 'KT1GBZmSxmnKJXGMdMLbugPfLyUPmuLSMwKS';

const LIMIT = 10000;

const fetchAllTokensBalances = async (selectedRpcUrl: string, account: string) => {
  const balances: TzktAccountTokenBalance[] = [];

  await (async function recourse(offset: number) {
    const response = await fetchTokensBalancesOnce(selectedRpcUrl, account, LIMIT, offset);
    const data = response.data;

    balances.push(...data);

    if (data.length === LIMIT) {
      await recourse(offset + LIMIT);
    }
  })(0);

  return balances;
};

const fetchTokensBalancesOnce = (selectedRpcUrl: string, account: string, limit: number, offset = 0) =>
  getTzktApi(selectedRpcUrl).get<Array<TzktAccountTokenBalance>>('/tokens/balances', {
    params: {
      account,
      'token.contract.ne': TEZOS_DOMAINS_NAME_REGISTRY_ADDRESS,
      'balance.gt': 0,
      'sort.desc': 'balance',
      limit,
      offset
    }
  });

export const loadTokensWithBalance$ = (selectedRpcUrl: string, accountPublicKeyHash: string) =>
  from(fetchAllTokensBalances(selectedRpcUrl, accountPublicKeyHash));

const mapTzktTokenBalance = (tztkBalances: Array<TzktAccountTokenBalance>) =>
  tztkBalances.map(value => ({
    slug: getTokenSlug({
      address: value.token.contract.address,
      id: value.token.tokenId
    }),
    balance: value.balance
  }));

export const loadTokensBalancesArrayFromTzkt$ = (selectedRpcUrl: string, accountPublicKeyHash: string) =>
  loadTokensWithBalance$(selectedRpcUrl, accountPublicKeyHash).pipe(
    map(tokenBalances => mapTzktTokenBalance(tokenBalances))
  );

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

export const loadAssetBalance$ = (rpcUrl: string, publicKeyHash: string, assetSlug: string) => {
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
    catchError(() => {
      return of(undefined);
    })
  );
};
