import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

// KordFi removed
import { ONE_MINUTE } from 'src/config/fixed-times';
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
  accountPkh: string
) => {
  const minDepositShares = 0;
  const deadline = new Date(Date.now() + ONE_MINUTE * 3).toISOString();

  const {
    methods: { approve, revoke },
    stakeContract
  } = await prepareToTransferParams(earnOpportunity, amount, tezos, accountPkh);

  if (false) {
    const depositTransferParams = stakeContract.methods
      .depositLending(minDepositShares, deadline)
      .toTransferParams({ mutez: true, amount: +amount });

    return [depositTransferParams];
  }

  const depositTransferParams = stakeContract.methods
    .depositLending(amount, minDepositShares, deadline)
    .toTransferParams();

  return [...approve, depositTransferParams, ...revoke];
};

export const createKordFiStakeTransfersParams = async (
  earnOpportunity: SavingsItem,
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  accountPkh: string,
  threeRouteTokens: Route3Token[],
  slippageTolerancePercentage: number
) => {
  const { stakedToken } = earnOpportunity;

  if (getTokenSlug(asset) === toTokenSlug(stakedToken.contractAddress, stakedToken.fa2TokenId)) {
    return getDepositTransferParams(earnOpportunity, amount, tezos, accountPkh);
  }

  const stakeTransferParams = await createStakeTransfersParams(
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
    stakeTransferParams.minimumReceivedAtomic.minus(stakeTransferParams.routingFeeFromOutputAtomic),
    tezos,
    accountPkh
  );

  const { feeFromInputTransferParams, feeFromOutputTransferParams, swapTransferParams } =
    stakeTransferParams.transferParams;

  return [
    ...feeFromInputTransferParams,
    ...swapTransferParams,
    ...depositTransferParams,
    ...feeFromOutputTransferParams
  ];
};
