import { TezosToolkit } from '@taquito/taquito';
import { Observable, withLatestFrom } from 'rxjs';

import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { FarmContractStorageInterface } from 'src/interfaces/earn.interface';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { Farm } from 'src/types/farm';
import { getLastElement } from 'src/utils/array.utils';
import { calculateYouvesFarmingRewards } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { getBalance } from 'src/utils/token-balance.utils';

import { ExchangeRateRecord } from '../currency/currency-state';
import { RootState } from '../types';

export interface RawStakeValue {
  lastStakeId: string;
  depositAmountAtomic: string;
  claimableRewards: string;
  fullReward: string;
  ageTimestamp: string;
}

export class GetFarmStakeError extends Error {
  constructor(public readonly farmAddress: string, message: string) {
    super(message);
  }
}

export const toUserStakeValueInterface = (
  stake: RawStakeValue,
  vestingPeriodSeconds: string
): UserStakeValueInterface => {
  const { ageTimestamp, ...rest } = stake;

  return {
    ...rest,
    rewardsDueDate: new Date(ageTimestamp).getTime() + Number(vestingPeriodSeconds) * 1000
  };
};

export const getFarmStake = async (farm: Farm, tezos: TezosToolkit, accountPkh: string) => {
  if (farm.type === EarnOpportunityTypeEnum.LIQUIDITY_BAKING) {
    const sirsTokenContract = await getReadOnlyContract(farm.stakedToken.contractAddress, tezos);
    const depositAmountAtomic = await getBalance(sirsTokenContract, accountPkh, farm.stakedToken.fa2TokenId);

    return depositAmountAtomic.isZero()
      ? null
      : {
          lastStakeId: '0',
          depositAmountAtomic: depositAmountAtomic.toFixed(),
          claimableRewards: '0',
          fullReward: '0',
          ageTimestamp: new Date().toISOString()
        };
  }

  const farmContractInstance = await tezos.contract.at(farm.contractAddress);
  const farmContractStorage = await farmContractInstance.storage<FarmContractStorageInterface>();
  const stakesIds = await farmContractStorage.stakes_owner_lookup.get(accountPkh);

  const lastStakeId = getLastElement(stakesIds ?? []);

  if (!isDefined(lastStakeId)) {
    return null;
  }

  const stakeAmount = await farmContractStorage.stakes.get(lastStakeId);

  if (!isDefined(stakeAmount)) {
    return null;
  }

  const rewardTokenContractInstance = await getReadOnlyContract(farm.rewardToken.contractAddress, tezos);
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
    fullReward: fullReward.toFixed(),
    ageTimestamp: stakeAmount.age_timestamp
  };
};

export const withExchangeRates =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { currency }): [T, ExchangeRateRecord] => {
        return [value, currency.usdToTokenRates.data];
      })
    );
