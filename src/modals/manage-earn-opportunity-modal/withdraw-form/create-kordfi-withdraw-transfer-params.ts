import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ONE_MINUTE } from 'src/config/fixed-times';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { percentageToFraction } from 'src/utils/percentage.utils';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';

export const getKordFiWithdrawTransferParams = async (
  earnOpportunity: SavingsItem,
  percentage: number,
  tezos: TezosToolkit,
  stake: UserStakeValueInterface
) => {
  const deadline = new Date(Date.now() + ONE_MINUTE * 3).toISOString();
  const amount = new BigNumber(stake.depositAmountAtomic ?? 0)
    .times(percentageToFraction(percentage))
    .integerValue(BigNumber.ROUND_DOWN);

  const contract = await getReadOnlyContract(earnOpportunity.contractAddress, tezos);

  return [contract.methods.redeemLending(+amount, deadline).toTransferParams()];
};
