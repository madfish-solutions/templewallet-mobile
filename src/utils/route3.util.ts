import { MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { intersection, transform } from 'lodash-es';
import { from, map } from 'rxjs';

import { ROUTE3_BASE_URL, route3Api } from 'src/apis/route3';
import {
  Hop,
  Route3Dex,
  Route3LiquidityBakingParamsResponse,
  Route3SwapParamsRequest,
  Route3TraditionalSwapParamsResponse,
  Route3Token,
  Route3LbSwapParamsRequest,
  Route3Hop
} from 'src/interfaces/route3.interface';
import {
  THREE_ROUTE_SIRS_TOKEN,
  THREE_ROUTE_TZBTC_TOKEN,
  THREE_ROUTE_XTZ_TOKEN
} from 'src/token/data/three-route-tokens';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { TEMPLE_WALLET_ROUTE3_AUTH_TOKEN } from './env.utils';
import { isDefined } from './is-defined';
import { isString } from './is-string';

export const fetchRoute3Tokens$ = () =>
  from(route3Api.get<Array<Route3Token>>('/tokens')).pipe(map(response => response.data));

const parser = (origJSON: string): ReturnType<(typeof JSON)['parse']> => {
  const stringedJSON = origJSON
    .replace(/input":\s*([-+Ee0-9.]+)/g, 'input":"$1"')
    .replace(/output":\s*([-+Ee0-9.]+)/g, 'output":"$1"');

  return JSON.parse(stringedJSON);
};

function getRoute3ParametrizedUrlPart(params: Route3SwapParamsRequest): string;
function getRoute3ParametrizedUrlPart(params: Route3LbSwapParamsRequest): string;
function getRoute3ParametrizedUrlPart(params: Route3SwapParamsRequest | Route3LbSwapParamsRequest) {
  const { fromSymbol, toSymbol, amount, ...queryParams } = params;
  const searchParams = new URLSearchParams(
    transform<typeof queryParams, StringRecord>(
      queryParams,
      (res, value, key) => {
        if (isDefined(value)) {
          res[key] = String(value);
        }
      },
      {}
    )
  );
  const searchString = searchParams.toString();

  return `/${fromSymbol}/${toSymbol}/${amount}${isString(searchString) ? `?${searchString}` : ''}`;
}

const fetchRoute3TraditionalSwapParams = (
  params: Route3SwapParamsRequest
): Promise<Route3TraditionalSwapParamsResponse> =>
  fetch(`${ROUTE3_BASE_URL}/swap${getRoute3ParametrizedUrlPart(params)}`, {
    headers: {
      Authorization: TEMPLE_WALLET_ROUTE3_AUTH_TOKEN
    }
  })
    .then(res => res.text())
    .then(res => parser(res));

export const fetchRoute3LiquidityBakingParams = (
  params: Route3LbSwapParamsRequest
): Promise<Route3LiquidityBakingParamsResponse> =>
  fetch(`${ROUTE3_BASE_URL}/swap-sirs${getRoute3ParametrizedUrlPart(params)}`, {
    headers: {
      Authorization: TEMPLE_WALLET_ROUTE3_AUTH_TOKEN
    }
  })
    .then(res => res.text())
    .then(res => parser(res));

export const fetchRoute3SwapParams = ({ fromSymbol, toSymbol, amount, dexesLimit }: Route3SwapParamsRequest) => {
  const isLbUnderlyingTokenSwap =
    intersection([fromSymbol, toSymbol], [THREE_ROUTE_TZBTC_TOKEN.symbol, THREE_ROUTE_XTZ_TOKEN.symbol]).length > 0;

  return [fromSymbol, toSymbol].includes(THREE_ROUTE_SIRS_TOKEN.symbol)
    ? fetchRoute3LiquidityBakingParams({
        fromSymbol,
        toSymbol,
        amount,
        // XTZ <-> SIRS and TZBTC <-> SIRS swaps have either XTZ or TZBTC hops, so a total number of hops cannot exceed the limit
        xtzDexesLimit: isDefined(dexesLimit)
          ? isLbUnderlyingTokenSwap
            ? dexesLimit
            : Math.ceil(dexesLimit / 2)
          : undefined,
        tzbtcDexesLimit: isDefined(dexesLimit)
          ? isLbUnderlyingTokenSwap
            ? dexesLimit
            : Math.floor(dexesLimit / 2)
          : undefined
      })
    : fetchRoute3TraditionalSwapParams({ fromSymbol, toSymbol, amount, dexesLimit });
};

export const fetchRoute3Dexes$ = () =>
  from(route3Api.get<Array<Route3Dex>>('/dexes')).pipe(map(response => response.data));

export const mapToRoute3ExecuteHops = (hops: Route3Hop[]): MichelsonMap<string, Hop> => {
  const result = new MichelsonMap<string, Hop>();

  hops.forEach(({ dexId, tokenInAmount, tradingBalanceAmount, code, params }, index) =>
    result.set(index.toString(), {
      dex_id: dexId,
      code,
      amount_from_token_in_reserves: new BigNumber(tokenInAmount),
      amount_from_trading_balance: new BigNumber(tradingBalanceAmount),
      params: params ?? ''
    })
  );

  return result;
};

export const getRoute3TokenSymbol = (token: TokenInterface) => {
  if (token.symbol === TEZ_TOKEN_METADATA.symbol) {
    return 'xtz';
  }

  return token.symbol;
};

const getRoute3TokenSlug = ({ contract, tokenId }: Route3Token) => toTokenSlug(contract ?? '', tokenId ?? 0);

export const getRoute3TokenBySlug = (route3Tokens: Array<Route3Token>, slug: string | undefined) => {
  if (slug === TEZ_TOKEN_SLUG) {
    return route3Tokens.find(({ contract }) => contract === null);
  }

  return route3Tokens.find(token => getRoute3TokenSlug(token) === slug);
};
