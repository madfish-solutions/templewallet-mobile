import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { Route3Token } from 'src/interfaces/route3.interface';
import { createStakeTransfersParams } from 'src/modals/manage-earn-opportunity-modal/stake-form/create-stake-transfer-params';
import { prepareToTransferParams } from 'src/modals/manage-earn-opportunity-modal/stake-form/utils';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';

const getDepositTransferParams = async (
  earnOpportunity: SavingsItem,
  amount: BigNumber,
  tezos: TezosToolkit,
  accountPkh: string,
  stakeId: string | undefined
) => {
  const {
    methods: { approve, revoke },
    stakeContract
  } = await prepareToTransferParams(earnOpportunity, amount, tezos, accountPkh);

  const depositTransferParams = stakeContract.methods.deposit(new BigNumber(stakeId ?? 0), amount).toTransferParams();

  return [...approve, depositTransferParams, ...revoke];
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

  const {
    minimumReceivedAtomic,
    routingFeeFromOutputAtomic,
    transferParams: { feeFromInputTransferParams, feeFromOutputTransferParams, swapTransferParams }
  } = await createStakeTransfersParams(
    earnOpportunity,
    amount,
    asset,
    tezos,
    accountPkh,
    threeRouteTokens,
    slippageTolerancePercentage
  );

  const depositTransferParams = await getDepositTransferParams(
    earnOpportunity,
    minimumReceivedAtomic.minus(routingFeeFromOutputAtomic),
    tezos,
    accountPkh,
    stakeId
  );

  return [
    ...feeFromInputTransferParams,
    ...swapTransferParams,
    ...depositTransferParams,
    ...feeFromOutputTransferParams
  ];
};
