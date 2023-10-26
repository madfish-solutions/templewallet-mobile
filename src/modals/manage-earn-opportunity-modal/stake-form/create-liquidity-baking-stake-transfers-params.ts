import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { MAX_ROUTING_FEE_CHAINS, ROUTING_FEE_ADDRESS } from 'src/config/swap';
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
  calculateRoutingInputAndFeeFromInput,
  calculateFeeFromOutput,
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
  slippageTolerancePercentage: number
) => {
  const inputIsTezos = getTokenSlug(asset) === TEZ_TOKEN_SLUG;
  const inputToken = inputIsTezos ? THREE_ROUTE_XTZ_TOKEN : THREE_ROUTE_TZBTC_TOKEN;
  const { swapInputMinusFeeAtomic, routingFeeFromInputAtomic } = calculateRoutingInputAndFeeFromInput(amount);
  const {
    output: rawSwapOutput,
    tzbtcChain,
    xtzChain
  } = await fetchRoute3LiquidityBakingParams({
    fromSymbol: inputToken.symbol,
    toSymbol: 'SIRS',
    amount: mutezToTz(swapInputMinusFeeAtomic, inputToken.decimals).toFixed(),
    chainsLimit: MAX_ROUTING_FEE_CHAINS
  });
  const slippageRatio = calculateSlippageRatio(slippageTolerancePercentage);
  const swapOutputAtomic = BigNumber.max(
    new BigNumber(rawSwapOutput ?? ZERO).times(slippageRatio).integerValue(BigNumber.ROUND_DOWN),
    1
  );
  const routingFeeFromOutputAtomic = calculateFeeFromOutput(amount, swapOutputAtomic);

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
    { tzbtcChain, xtzChain },
    tezos,
    accountPkh
  );

  return [...transferFeeFromInputParams, ...threeRouteSwapOpParams, ...transferFeeFromOutputParams];
};
