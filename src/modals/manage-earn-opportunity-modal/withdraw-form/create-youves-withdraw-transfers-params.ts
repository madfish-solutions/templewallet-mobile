import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { isDefined } from 'src/utils/is-defined';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';

export const createYouvesWithdrawTransfersParams = async (
  youvesSavingsItem: SavingsItem,
  tezos: TezosToolkit,
  stake: UserStakeValueInterface,
  percentage: number
) => {
  const percentageDecimalPlaces = new BigNumber(percentage).decimalPlaces();

  if (!isDefined(percentageDecimalPlaces)) {
    throw new Error('Invalid percentage');
  }

  const ratioNumerator = new BigNumber(percentage).shiftedBy(percentageDecimalPlaces);
  const ratioDenominator = new BigNumber(100).shiftedBy(percentageDecimalPlaces);
  const contract = await getReadOnlyContract(youvesSavingsItem.contractAddress, tezos);

  return [
    contract.methodsObject
      .withdraw({ ratio_denominator: ratioDenominator, ratio_numerator: ratioNumerator, stake_id: stake.lastStakeId })
      .toTransferParams()
  ];
};
