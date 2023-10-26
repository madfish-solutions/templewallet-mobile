import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ROUTING_FEE_ADDRESS } from 'src/config/swap';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { Route3Token } from 'src/interfaces/route3.interface';
import { ToastError } from 'src/toast/error-toast.utils';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { fetchRoute3SwapParams, getRoute3TokenSlug } from 'src/utils/route3.util';
import {
  calculateRoutingInputAndFeeFromInput,
  calculateSlippageRatio,
  calculateFeeFromOutput,
  getSwapTransferParams,
  getRoutingFeeTransferParams
} from 'src/utils/swap.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

export const createStakeTransfersParams = async (
  earnOpportunity: SavingsItem,
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  accountPkh: string,
  threeRouteTokens: Route3Token[],
  slippageTolerancePercentage: number
) => {
  const { stakedToken } = earnOpportunity;

  const fromRoute3Token = threeRouteTokens.find(
    token => toTokenSlug(token.contract, token.tokenId) === getTokenSlug(asset)
  );
  const toRoute3Token = threeRouteTokens.find(
    token =>
      toTokenSlug(token.contract, token.tokenId) === toTokenSlug(stakedToken.contractAddress, stakedToken.fa2TokenId)
  );

  if (!isDefined(fromRoute3Token)) {
    throw new Error('Failed to find 3route input token');
  }

  if (!isDefined(toRoute3Token)) {
    throw new Error('Failed to find 3route output token');
  }

  const { swapInputMinusFeeAtomic, routingFeeFromInputAtomic } = calculateRoutingInputAndFeeFromInput(amount);
  const threeRouteSwapParams = await fetchRoute3SwapParams({
    fromSymbol: fromRoute3Token.symbol,
    toSymbol: toRoute3Token.symbol,
    amount: mutezToTz(swapInputMinusFeeAtomic, asset.decimals).toString(),
    chainsLimit: getRoute3TokenSlug(fromRoute3Token) === KNOWN_TOKENS_SLUGS.SIRS ? 1 : 2
  });

  if (!isDefined(threeRouteSwapParams.output) || threeRouteSwapParams.output === '0') {
    throw new ToastError('Failed to deposit', 'Please try depositing a bigger amount');
  }

  const minimumReceivedAtomic = BigNumber.max(
    tzToMutez(new BigNumber(threeRouteSwapParams.output), stakedToken.metadata.decimals)
      .times(calculateSlippageRatio(slippageTolerancePercentage))
      .integerValue(BigNumber.ROUND_DOWN),
    1
  );
  const routingFeeFromOutputAtomic = calculateFeeFromOutput(amount, minimumReceivedAtomic);
  const swapTransferParams = await getSwapTransferParams(
    fromRoute3Token,
    toRoute3Token,
    swapInputMinusFeeAtomic,
    minimumReceivedAtomic,
    threeRouteSwapParams,
    tezos,
    accountPkh
  );
  const feeFromInputTransferParams = await getRoutingFeeTransferParams(
    fromRoute3Token,
    routingFeeFromInputAtomic,
    accountPkh,
    ROUTING_FEE_ADDRESS,
    tezos
  );
  const feeFromOutputTransferParams = await getRoutingFeeTransferParams(
    toRoute3Token,
    routingFeeFromOutputAtomic,
    accountPkh,
    ROUTING_FEE_ADDRESS,
    tezos
  );

  return {
    transferParams: {
      feeFromInputTransferParams,
      swapTransferParams,
      feeFromOutputTransferParams
    },
    routingFeeFromOutputAtomic,
    minimumReceivedAtomic
  };
};
