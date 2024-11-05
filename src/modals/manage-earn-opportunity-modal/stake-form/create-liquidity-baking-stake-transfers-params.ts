import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ROUTING_FEE_ADDRESS, SINGLE_SIRS_SWAP_MAX_DEXES } from 'src/config/swap';
import {
  THREE_ROUTE_SIRS_TOKEN,
  THREE_ROUTE_TZBTC_TOKEN,
  THREE_ROUTE_XTZ_TOKEN
} from 'src/token/data/three-route-tokens';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { ZERO } from 'src/utils/number.util';
import { fetchRoute3LiquidityBakingParams } from 'src/utils/route3.util';
import {
  calculateOutputFeeAtomic,
  calculateSidePaymentsFromInput,
  calculateSlippageRatio,
  getSwapTransferParams,
  getRoutingFeeTransferParams
} from 'src/utils/swap.utils';
import { mutezToTz } from 'src/utils/tezos.util';

export const createLiquidityBakingStakeTransfersParams = async (
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  accountPkh: string,
  slippageTolerancePercentage: number,
  rpcUrl: string
) => {
  const inputIsTezos = getTokenSlug(asset) === TEZ_TOKEN_SLUG;
  const inputToken = inputIsTezos ? THREE_ROUTE_XTZ_TOKEN : THREE_ROUTE_TZBTC_TOKEN;
  const { swapInputMinusFeeAtomic, inputFeeAtomic: routingFeeFromInputAtomic } = calculateSidePaymentsFromInput(amount);
  const {
    output: rawSwapOutput,
    tzbtcHops,
    xtzHops
  } = await fetchRoute3LiquidityBakingParams({
    fromSymbol: inputToken.symbol,
    toSymbol: THREE_ROUTE_SIRS_TOKEN.symbol,
    toTokenDecimals: THREE_ROUTE_SIRS_TOKEN.decimals,
    amount: mutezToTz(swapInputMinusFeeAtomic, inputToken.decimals).toFixed(),
    // Such swap has either XTZ or tzBTC hops
    xtzDexesLimit: SINGLE_SIRS_SWAP_MAX_DEXES,
    tzbtcDexesLimit: SINGLE_SIRS_SWAP_MAX_DEXES,
    rpcUrl
  });
  const slippageRatio = calculateSlippageRatio(slippageTolerancePercentage);
  const swapOutputAtomic = BigNumber.max(
    new BigNumber(rawSwapOutput ?? ZERO).times(slippageRatio).integerValue(BigNumber.ROUND_DOWN),
    1
  );
  const routingFeeFromOutputAtomic = calculateOutputFeeAtomic(amount, swapOutputAtomic);

  if (
    !isDefined(rawSwapOutput) ||
    rawSwapOutput === ZERO.toFixed() ||
    routingFeeFromOutputAtomic.gte(swapOutputAtomic)
  ) {
    throw new Error('Please try depositing a bigger amount');
  }

  const transferFeeFromInputParams = await getRoutingFeeTransferParams(
    inputToken,
    routingFeeFromInputAtomic,
    accountPkh,
    ROUTING_FEE_ADDRESS,
    tezos
  );

  const transferFeeFromOutputParams = await getRoutingFeeTransferParams(
    THREE_ROUTE_SIRS_TOKEN,
    routingFeeFromOutputAtomic,
    accountPkh,
    ROUTING_FEE_ADDRESS,
    tezos
  );

  const threeRouteSwapOpParams = await getSwapTransferParams(
    inputToken,
    THREE_ROUTE_SIRS_TOKEN,
    swapInputMinusFeeAtomic,
    swapOutputAtomic,
    { tzbtcHops, xtzHops },
    tezos,
    accountPkh
  );

  return [...transferFeeFromInputParams, ...threeRouteSwapOpParams, ...transferFeeFromOutputParams];
};
