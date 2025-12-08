import { BigNumber } from 'bignumber.js';
import { intersection, transform } from 'lodash-es';
import { from, map } from 'rxjs';

import { ROUTE3_BASE_URL, route3Api } from 'src/apis/route3';
import { SIRS_LIQUIDITY_SLIPPAGE_RATIO } from 'src/config/swap';
import {
  Route3Dex,
  Route3LiquidityBakingParamsResponse,
  Route3SwapParamsRequest,
  Route3TraditionalSwapParamsResponse,
  Route3Token,
  Route3LbSwapParamsRequest,
  Route3EmptyTreeNode,
  Route3TreeNodeType,
  Route3TreeNode
} from 'src/interfaces/route3.interface';
import {
  THREE_ROUTE_SIRS_TOKEN,
  THREE_ROUTE_TZBTC_TOKEN,
  THREE_ROUTE_XTZ_TOKEN
} from 'src/token/data/three-route-tokens';
import {
  SIRS_TOKEN_METADATA,
  TEZ_TOKEN_METADATA,
  TEZ_TOKEN_SLUG,
  TZBTC_TOKEN_METADATA
} from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { TEMPLE_WALLET_ROUTE3_AUTH_TOKEN } from './env.utils';
import { getLbStorage } from './swap.utils';
import { mutezToTz, tzToMutez } from './tezos.util';

export const fetchRoute3Tokens$ = () =>
  from(route3Api.get<Array<Route3Token>>('/tokens')).pipe(map(response => response.data));

const parser = (origJSON: string): ReturnType<(typeof JSON)['parse']> => {
  const stringedJSON = origJSON.replace(/(input|output|tokenInAmount|tokenOutAmount)":\s*([-+Ee0-9.]+)/g, '$1":"$2"');

  try {
    return JSON.parse(stringedJSON);
  } catch {}
};

function getRoute3ParametrizedUrlPart(params: Route3SwapParamsRequest): string;
function getRoute3ParametrizedUrlPart(params: Route3LbSwapParamsRequest): string;
function getRoute3ParametrizedUrlPart(params: Route3SwapParamsRequest | Route3LbSwapParamsRequest) {
  const { fromSymbol, toSymbol, amount, toTokenDecimals, rpcUrl, ...queryParams } = params;
  const searchParams = new URLSearchParams(
    transform<typeof queryParams, StringRecord>(
      queryParams,
      (res, value, key) => {
        res[key] = String(value);
      },
      {}
    )
  );

  return `/${fromSymbol}/${toSymbol}/${amount}?${searchParams.toString()}`;
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

const makeEmptyTreeNode = (
  tokenInId: number,
  tokenOutId: number,
  tokenInAmount: string,
  tokenOutAmount: string
): Route3EmptyTreeNode => ({
  type: Route3TreeNodeType.Empty,
  items: [],
  dexId: null,
  tokenInId,
  tokenOutId,
  tokenInAmount,
  tokenOutAmount,
  width: 0,
  height: 0
});

const fetchOriginalRoute3LiquidityBakingParams = async (
  params: Route3LbSwapParamsRequest
): Promise<Route3LiquidityBakingParamsResponse> => {
  const originalResponse = await fetch(`${ROUTE3_BASE_URL}/swap-sirs${getRoute3ParametrizedUrlPart(params)}`, {
    headers: {
      Authorization: TEMPLE_WALLET_ROUTE3_AUTH_TOKEN
    }
  });

  return parser(await originalResponse.text());
};

const correctOutput = <T extends Route3TreeNode>(tree: T, newOutput: BigNumber, toTokenDecimals: number): T => {
  if (new BigNumber(tree.tokenOutAmount).eq(newOutput)) {
    return tree;
  }

  const lastItemIndex = (tree.items ?? []).length - 1;

  switch (tree.type) {
    case Route3TreeNodeType.Empty:
    case Route3TreeNodeType.Dex:
      return { ...tree, tokenOutAmount: newOutput.toFixed() };
    case Route3TreeNodeType.Wide:
      const wideNodeNewItems = [...tree.items];
      wideNodeNewItems[lastItemIndex] = correctOutput(wideNodeNewItems[lastItemIndex], newOutput, toTokenDecimals);

      return { ...tree, tokenOutAmount: newOutput.toFixed(), items: wideNodeNewItems };
    default:
      const multiplier = newOutput.div(new BigNumber(tree.tokenOutAmount));
      let outputLeft = newOutput;
      const highNodeNewItems = tree.items.map((item, index) => {
        const newOutput =
          index === lastItemIndex
            ? outputLeft
            : new BigNumber(item.tokenOutAmount)
                .times(multiplier)
                .decimalPlaces(toTokenDecimals, BigNumber.ROUND_FLOOR);
        outputLeft = outputLeft.minus(newOutput);

        return correctOutput(item, newOutput, toTokenDecimals);
      });

      return { ...tree, tokenOutAmount: newOutput.toFixed(), items: highNodeNewItems };
  }
};

export const fetchRoute3LiquidityBakingParams = async (
  params: Route3LbSwapParamsRequest
): Promise<Route3LiquidityBakingParamsResponse> => {
  const { rpcUrl, toSymbol, toTokenDecimals } = params;

  if (params.fromSymbol === THREE_ROUTE_SIRS_TOKEN.symbol) {
    const { tokenPool, xtzPool, lqtTotal } = await getLbStorage(params.rpcUrl);
    const sirsAtomicAmount = tzToMutez(new BigNumber(params.amount), THREE_ROUTE_SIRS_TOKEN.decimals);
    const tzbtcAtomicAmount = sirsAtomicAmount
      .times(tokenPool)
      .times(SIRS_LIQUIDITY_SLIPPAGE_RATIO)
      .dividedToIntegerBy(lqtTotal);
    const xtzAtomicAmount = sirsAtomicAmount
      .times(xtzPool)
      .times(SIRS_LIQUIDITY_SLIPPAGE_RATIO)
      .dividedToIntegerBy(lqtTotal);
    const xtzInAmount = mutezToTz(xtzAtomicAmount, THREE_ROUTE_XTZ_TOKEN.decimals).toFixed();
    const tzbtcInAmount = mutezToTz(tzbtcAtomicAmount, THREE_ROUTE_TZBTC_TOKEN.decimals).toFixed();
    const {
      output: originalOutput,
      xtzTree: originalXtzTree,
      tzbtcTree: originalTzbtcTree
    } = await fetchOriginalRoute3LiquidityBakingParams(params);
    const [fromXtzSwapParams, fromTzbtcSwapParams] = await Promise.all<Route3TraditionalSwapParamsResponse>([
      toSymbol === THREE_ROUTE_XTZ_TOKEN.symbol
        ? {
            input: xtzInAmount,
            output: xtzInAmount,
            hops: [],
            tree: makeEmptyTreeNode(THREE_ROUTE_XTZ_TOKEN.id, THREE_ROUTE_XTZ_TOKEN.id, xtzInAmount, xtzInAmount)
          }
        : fetchRoute3TraditionalSwapParams({
            fromSymbol: THREE_ROUTE_XTZ_TOKEN.symbol,
            toSymbol: toSymbol,
            amount: xtzInAmount,
            toTokenDecimals,
            rpcUrl,
            dexesLimit: params.xtzDexesLimit,
            showTree: true
          }),
      toSymbol === THREE_ROUTE_TZBTC_TOKEN.symbol
        ? {
            input: tzbtcInAmount,
            output: tzbtcInAmount,
            hops: [],
            tree: makeEmptyTreeNode(
              THREE_ROUTE_TZBTC_TOKEN.id,
              THREE_ROUTE_TZBTC_TOKEN.id,
              tzbtcInAmount,
              tzbtcInAmount
            )
          }
        : fetchRoute3TraditionalSwapParams({
            fromSymbol: THREE_ROUTE_TZBTC_TOKEN.symbol,
            toSymbol: toSymbol,
            amount: tzbtcInAmount,
            toTokenDecimals,
            rpcUrl,
            dexesLimit: params.tzbtcDexesLimit,
            showTree: true
          })
    ]);

    if (fromTzbtcSwapParams.output === undefined || fromXtzSwapParams.output === undefined) {
      return {
        input: params.amount,
        output: undefined,
        tzbtcHops: [],
        xtzHops: [],
        tzbtcTree: makeEmptyTreeNode(THREE_ROUTE_TZBTC_TOKEN.id, -1, tzbtcInAmount, '0'),
        xtzTree: makeEmptyTreeNode(THREE_ROUTE_XTZ_TOKEN.id, -1, xtzInAmount, '0')
      };
    }

    if (originalOutput !== undefined) {
      // TODO: improve the correction
      const correctedXtzSwapOutput = BigNumber.min(originalXtzTree.tokenOutAmount, fromXtzSwapParams.output);
      const correctedTzbtcSwapOutput = BigNumber.min(originalTzbtcTree.tokenOutAmount, fromTzbtcSwapParams.output);
      fromXtzSwapParams.output = correctedXtzSwapOutput.toFixed();
      fromTzbtcSwapParams.output = correctedTzbtcSwapOutput.toFixed();
      const newFromXtzSwapParamsTree = correctOutput(fromXtzSwapParams.tree, correctedXtzSwapOutput, toTokenDecimals);
      const newFromTzbtcSwapParamsTree = correctOutput(
        fromTzbtcSwapParams.tree,
        correctedTzbtcSwapOutput,
        toTokenDecimals
      );
      fromXtzSwapParams.tree = newFromXtzSwapParamsTree;
      fromTzbtcSwapParams.tree = newFromTzbtcSwapParamsTree;
    }

    return {
      input: params.amount,
      output: new BigNumber(fromTzbtcSwapParams.output).plus(fromXtzSwapParams.output).toFixed(),
      tzbtcHops: fromTzbtcSwapParams.hops,
      xtzHops: fromXtzSwapParams.hops,
      tzbtcTree: fromTzbtcSwapParams.tree,
      xtzTree: fromXtzSwapParams.tree
    };
  }

  return fetchOriginalRoute3LiquidityBakingParams(params);
};

export const isSirsSwap = (from: string | Pick<Route3Token, 'symbol'>, to: string | Pick<Route3Token, 'symbol'>) => {
  return [from, to]
    .map(symbolOrToken => (typeof symbolOrToken === 'string' ? symbolOrToken : symbolOrToken.symbol))
    .includes(THREE_ROUTE_SIRS_TOKEN.symbol);
};

export const fetchRoute3SwapParams = ({
  fromSymbol,
  toSymbol,
  amount,
  dexesLimit,
  ...restParams
}: Omit<Route3SwapParamsRequest, 'showTree'>) => {
  const isLbUnderlyingTokenSwap =
    intersection([fromSymbol, toSymbol], [THREE_ROUTE_TZBTC_TOKEN.symbol, THREE_ROUTE_XTZ_TOKEN.symbol]).length > 0;

  return isSirsSwap(fromSymbol, toSymbol)
    ? fetchRoute3LiquidityBakingParams({
        fromSymbol,
        toSymbol,
        amount,
        // XTZ <-> SIRS and TZBTC <-> SIRS swaps have either XTZ or TZBTC hops, so a total number of hops cannot exceed the limit
        xtzDexesLimit: isLbUnderlyingTokenSwap ? dexesLimit : Math.ceil(dexesLimit / 2),
        tzbtcDexesLimit: isLbUnderlyingTokenSwap ? dexesLimit : Math.floor(dexesLimit / 2),
        showTree: true,
        ...restParams
      })
    : fetchRoute3TraditionalSwapParams({ fromSymbol, toSymbol, amount, dexesLimit, showTree: true, ...restParams });
};

export const fetchRoute3Dexes$ = () =>
  from(route3Api.get<Array<Route3Dex>>('/dexes')).pipe(map(response => response.data));

const route3TokenSymbols = {
  [TEZ_TOKEN_METADATA.symbol]: THREE_ROUTE_XTZ_TOKEN.symbol,
  [TZBTC_TOKEN_METADATA.symbol]: THREE_ROUTE_TZBTC_TOKEN.symbol,
  [SIRS_TOKEN_METADATA.symbol]: THREE_ROUTE_SIRS_TOKEN.symbol
};
export const getRoute3TokenSymbol = (token: TokenInterface) => {
  return route3TokenSymbols[token.symbol] ?? token.symbol;
};

const getRoute3TokenSlug = ({ contract, tokenId }: Route3Token) => toTokenSlug(contract ?? '', tokenId ?? 0);

export const getRoute3TokenBySlug = (route3Tokens: Array<Route3Token>, slug: string | undefined) => {
  if (slug === TEZ_TOKEN_SLUG) {
    return route3Tokens.find(({ contract }) => contract === null);
  }

  return route3Tokens.find(token => getRoute3TokenSlug(token) === slug);
};
