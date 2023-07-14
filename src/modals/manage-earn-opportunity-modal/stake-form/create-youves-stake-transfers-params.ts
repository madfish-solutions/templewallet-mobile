import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ROUTING_FEE_ADDRESS } from 'src/config/swap';
import { EarnOpportunityTokenStandardEnum } from 'src/enums/earn-opportunity-token-standard.enum';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { Route3Token } from 'src/interfaces/route3.interface';
import { ToastError } from 'src/toast/error-toast.utils';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { fetchRoute3SwapParams } from 'src/utils/route3.util';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import {
  calculateRoutingInputAndFee,
  calculateSlippageRatio,
  getRoutingFeeTransferParams,
  getSwapTransferParams
} from 'src/utils/swap.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

const getDepositTransferParams = async (
  earnOpportunity: SavingsItem,
  amount: BigNumber,
  tezos: TezosToolkit,
  accountPkh: string,
  stakeId: string | undefined
) => {
  const { contractAddress: stakeAddress, stakedToken } = earnOpportunity;
  const partialThreeRouteStakedToken = {
    standard:
      stakedToken.type === EarnOpportunityTokenStandardEnum.Fa2
        ? Route3TokenStandardEnum.fa2
        : Route3TokenStandardEnum.fa12,
    contract: stakedToken.contractAddress,
    tokenId: stakedToken.fa2TokenId?.toString() ?? '0'
  };
  const stakeContract = await getReadOnlyContract(stakeAddress, tezos);
  const { approve: approveAsset, revoke: revokeAsset } = await getTransferPermissions(
    tezos,
    stakeAddress,
    accountPkh,
    partialThreeRouteStakedToken,
    amount
  );
  const depositTransferParams = stakeContract.methods.deposit(new BigNumber(stakeId ?? 0), amount).toTransferParams();

  return [...approveAsset, depositTransferParams, ...revokeAsset];
};

export const createYouvesStakeTransfersParams = async (
  earnOpportunity: SavingsItem,
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  accountPkh: string,
  stakeId: string | undefined,
  threeRouteTokens: Route3Token[],
  slippageTolerancePercentage: number
) => {
  const { stakedToken } = earnOpportunity;

  if (getTokenSlug(asset) === toTokenSlug(stakedToken.contractAddress, stakedToken.fa2TokenId)) {
    return getDepositTransferParams(earnOpportunity, amount, tezos, accountPkh, stakeId);
  }

  const fromRoute3Token = threeRouteTokens.find(
    token => toTokenSlug(token.contract, token.tokenId) === getTokenSlug(asset)
  );
  const toRoute3Token = threeRouteTokens.find(
    token =>
      toTokenSlug(token.contract, token.tokenId) === toTokenSlug(stakedToken.contractAddress, stakedToken.fa2TokenId)
  );

  if (!isDefined(fromRoute3Token) || !isDefined(toRoute3Token)) {
    throw new Error('Failed to find 3route input or output token');
  }

  const { swapInputMinusFeeAtomic, routingFeeAtomic } = calculateRoutingInputAndFee(amount);
  const threeRouteSwapParams = await fetchRoute3SwapParams({
    fromSymbol: fromRoute3Token.symbol,
    toSymbol: toRoute3Token.symbol,
    amount: mutezToTz(swapInputMinusFeeAtomic, asset.decimals).toString()
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
  const swapTransferParams = await getSwapTransferParams(
    fromRoute3Token,
    toRoute3Token,
    swapInputMinusFeeAtomic,
    minimumReceivedAtomic,
    threeRouteSwapParams,
    tezos,
    accountPkh
  );
  const feeTransferParams = await getRoutingFeeTransferParams(
    fromRoute3Token,
    routingFeeAtomic,
    accountPkh,
    ROUTING_FEE_ADDRESS,
    tezos
  );
  const depositTransferParams = await getDepositTransferParams(
    earnOpportunity,
    minimumReceivedAtomic,
    tezos,
    accountPkh,
    stakeId
  );

  return [...feeTransferParams, ...swapTransferParams, ...depositTransferParams];
};
