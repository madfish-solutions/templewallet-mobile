import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { tzktApi } from '../api.service';
import { GetAccountTokenBalancesResponseInterface } from '../interfaces/get-account-token-balances-response.interface';
import { TokenTypeEnum } from '../interfaces/token-type.enum';
import { TokenBalanceInterface } from '../token/interfaces/token-balance.interface';
import { getTokenType } from '../token/utils/token.utils';
import { isDefined } from './is-defined';
import { readOnlySignerAccount } from './read-only.signer.util';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';

const size = 10;

const getTokenBalances = (accountPublicKeyHash: string, offset: number) =>
  tzktApi.get<Array<GetAccountTokenBalancesResponseInterface>>('/tokens/balances', {
    params: { limit: size, offset, account: accountPublicKeyHash }
  });

export const mapAccountTokenBalancesToTokenBalanceInterfaces = (
  accountTokenBalance: GetAccountTokenBalancesResponseInterface
): TokenBalanceInterface => {
  const { balance, token } = accountTokenBalance;

  const { contract, tokenId, metadata } = token;

  const name = metadata?.name;
  const symbol = metadata?.symbol;
  const thumbnail = metadata?.thumbnail;
  const decimals = metadata?.decimals;
  const description = metadata?.description;

  return {
    balance,
    contract: contract.address,
    creators: [],
    decimals,
    description: description,
    formats: [],
    name,
    network: 'mainnet',
    symbol,
    tags: [],
    thumbnail_uri: thumbnail,
    token_id: Number(tokenId)
  };
};

export const loadTokensWithBalance$ = (accountPublicKeyHash: string) =>
  from(getTokenBalances(accountPublicKeyHash, 0)).pipe(
    switchMap(initialResponse => {
      if (initialResponse.data.length > size) {
        const numberOfAdditionalRequests = Math.floor(initialResponse.data.length / size);

        return forkJoin(
          new Array(numberOfAdditionalRequests)
            .fill(0)
            .map((_, index) => getTokenBalances(accountPublicKeyHash, (index + 1) * size))
        ).pipe(
          map(restResponses => [
            ...initialResponse.data,
            ...restResponses.map(restResponse => restResponse.data).flat()
          ])
        );
      } else {
        return of(initialResponse.data);
      }
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
