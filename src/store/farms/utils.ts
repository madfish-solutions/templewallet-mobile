import { TezosToolkit } from '@taquito/taquito';

import { Farm } from 'src/apis/quipuswap-staking/types';
import { FarmContractStorageInterface } from 'src/interfaces/earn.interface';
import { getLastElement } from 'src/utils/array.utils';
import { calculateYouvesFarmingRewards } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { getBalance } from 'src/utils/token-balance.utils';

export class GetFarmStakeError extends Error {
  constructor(public readonly farmAddress: string, message: string) {
    super(message);
  }
}

export const getFarmStake = async (farm: Farm, tezos: TezosToolkit, accountPkh: string) => {
  const farmContractInstance = await tezos.contract.at(farm.contractAddress);
  const farmContractStorage = await farmContractInstance.storage<FarmContractStorageInterface>();
  const stakesIds = await farmContractStorage.stakes_owner_lookup.get(accountPkh);

  if (isDefined(stakesIds)) {
    const lastStakeId = getLastElement(stakesIds);
    if (isDefined(lastStakeId)) {
      const stakeAmount = await farmContractStorage.stakes.get(lastStakeId);

      if (isDefined(stakeAmount)) {
        const rewardTokenContractInstance = await tezos.contract.at(farm.rewardToken.contractAddress);
        const farmBalanceInRewardToken = await getBalance(
          rewardTokenContractInstance,
          farm.contractAddress,
          farm.rewardToken.fa2TokenId
        );
        const { claimableReward, fullReward } = calculateYouvesFarmingRewards(
          {
            lastRewards: farmContractStorage.last_rewards.toFixed(),
            discFactor: farmContractStorage.disc_factor,
            vestingPeriodSeconds: farmContractStorage.max_release_period,
            totalStaked: farmContractStorage.total_stake
          },
          farmBalanceInRewardToken,
          stakeAmount
        );

        return {
          lastStakeId: lastStakeId.toFixed(),
          depositAmountAtomic: stakeAmount.stake.toFixed(),
          claimableRewards: claimableReward.toFixed(),
          fullReward: fullReward.toFixed()
        };
      }
    }
  }

  return undefined;
};
