import { MichelsonMap } from '@taquito/taquito';
import axios from 'axios';
import { BigNumber } from 'bignumber.js';
import { intersection, pick, transform } from 'lodash-es';
import memoizee from 'memoizee';
import { from, map } from 'rxjs';

import { ROUTE3_BASE_URL, route3Api } from 'src/apis/route3';
import { BLOCK_DURATION, ONE_MINUTE } from 'src/config/fixed-times';
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
import { LIQUIDITY_BAKING_DEX_ADDRESS } from 'src/token/data/token-slugs';
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
  const { fromSymbol, toSymbol, amount } = params;
  const queryParams =
    'dexesLimit' in params ? pick(params, 'dexesLimit') : pick(params, 'xtzDexesLimit', 'tzbtcDexesLimit');
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

const getLbSubsidyCausedXtzDeviation = memoizee(
  async (rpcUrl: string) => {
    const currentBlockRpcBaseURL = `${rpcUrl}/chains/main/blocks/head/context`;
    const [{ data: constants }, { data: rawSirsDexBalance }] = await Promise.all([
      axios.get<{ minimal_block_delay: string; liquidity_baking_subsidy: string }>(
        `${currentBlockRpcBaseURL}/constants`
      ),
      axios.get<string>(`${currentBlockRpcBaseURL}/contracts/${LIQUIDITY_BAKING_DEX_ADDRESS}/balance`)
    ]);
    const { minimal_block_delay: blockDuration = String(BLOCK_DURATION), liquidity_baking_subsidy: lbSubsidyPerMin } =
      constants;
    const lbSubsidyPerBlock = Math.floor(Number(lbSubsidyPerMin) / Math.floor(ONE_MINUTE / Number(blockDuration)));

    return lbSubsidyPerBlock / Number(rawSirsDexBalance);
  },
  { promise: true, maxAge: ONE_MINUTE * 5 }
);

export const fetchRoute3LiquidityBakingParams = (
  params: Route3LbSwapParamsRequest
): Promise<Route3LiquidityBakingParamsResponse> =>
  fetch(`${ROUTE3_BASE_URL}/swap-sirs${getRoute3ParametrizedUrlPart(params)}`, {
    headers: {
      Authorization: TEMPLE_WALLET_ROUTE3_AUTH_TOKEN
    }
  })
    .then(res => res.text())
    .then(async res => {
      const { rpcUrl, fromSymbol, toSymbol, toTokenDecimals } = params;
      const originalParams: Route3LiquidityBakingParamsResponse = parser(res);

      if (
        fromSymbol !== THREE_ROUTE_SIRS_TOKEN.symbol ||
        toSymbol === THREE_ROUTE_XTZ_TOKEN.symbol ||
        originalParams.output === undefined
      ) {
        return originalParams;
      }

      // SIRS -> not XTZ swaps are likely to fail with tez.subtraction_underflow error, preventing it
      try {
        const lbSubsidyCausedXtzDeviation = await getLbSubsidyCausedXtzDeviation(rpcUrl);
        const initialXtzInput = new BigNumber(originalParams.xtzHops[0].tokenInAmount);
        const correctedXtzInput = initialXtzInput.times(1 - lbSubsidyCausedXtzDeviation).integerValue();
        const initialOutput = new BigNumber(originalParams.output);
        // The difference between inputs is usually pretty small, so we can use the following formula
        const correctedOutput = initialOutput
          .times(correctedXtzInput)
          .div(initialXtzInput)
          .decimalPlaces(toTokenDecimals, BigNumber.ROUND_FLOOR);

        return {
          ...originalParams,
          output: correctedOutput.toString(),
          xtzHops: [
            {
              ...originalParams.xtzHops[0],
              tokenInAmount: correctedXtzInput.toFixed()
            }
          ].concat(originalParams.xtzHops.slice(1))
        };
      } catch (err) {
        console.error(err);

        return originalParams;
      }
    });

export const fetchRoute3SwapParams = ({
  fromSymbol,
  toSymbol,
  amount,
  dexesLimit,
  ...restParams
}: Route3SwapParamsRequest) => {
  const isLbUnderlyingTokenSwap =
    intersection([fromSymbol, toSymbol], [THREE_ROUTE_TZBTC_TOKEN.symbol, THREE_ROUTE_XTZ_TOKEN.symbol]).length > 0;

  return [fromSymbol, toSymbol].includes(THREE_ROUTE_SIRS_TOKEN.symbol)
    ? fetchRoute3LiquidityBakingParams({
        fromSymbol,
        toSymbol,
        amount,
        // XTZ <-> SIRS and TZBTC <-> SIRS swaps have either XTZ or TZBTC hops, so a total number of hops cannot exceed the limit
        xtzDexesLimit: isLbUnderlyingTokenSwap ? dexesLimit : Math.ceil(dexesLimit / 2),
        tzbtcDexesLimit: isLbUnderlyingTokenSwap ? dexesLimit : Math.floor(dexesLimit / 2),
        ...restParams
      })
    : fetchRoute3TraditionalSwapParams({ fromSymbol, toSymbol, amount, dexesLimit, ...restParams });
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
