import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { identity, uniq } from 'lodash';
import React, { memo, useCallback, useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import useSWR from 'swr';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';

import { BakerRewardItem } from './baker-reward-item/baker-reward-item';
import { useBakerRewardsListStyles } from './baker-rewards-list.styles';
import { BakingBadStory } from './interfaces/baking-bad';
import { BakingHistoryEntry } from './interfaces/baking-history-entry';
import { TzktSetDelegateParamsOperation } from './interfaces/tzkt';
import { bakingBadGetBakerStory } from './utils/baking-bad';
import { CycleStatus } from './utils/get-cycle-status-icon';
import { getRewardsStats } from './utils/get-rewards-stats';
import { fetchSetDelegateParametersOperations, getCycles, getDelegatorRewards, getProtocol } from './utils/tzkt';

const AVERAGE_ITEM_HEIGHT = 280;

const FALLBACK_STORY: BakingBadStory = {
  address: '',
  name: [{ cycle: 0, value: '' }],
  status: [{ cycle: 0, value: 'active' }],
  delegationEnabled: [{ cycle: 0, value: true }],
  delegationFee: [{ cycle: 0, value: 0 }],
  delegationMinBalance: [{ cycle: 0, value: 0 }],
  stakingEnabled: [{ cycle: 0, value: true }],
  stakingFee: [{ cycle: 0, value: 0 }],
  stakingLimit: [{ cycle: 0, value: 0 }]
};

const keyExtractor = (item: BakingHistoryEntry) => `${item.cycle},${item.bakerAddress}`;

const getCycleValue = <T, U>(
  entries: T[],
  cycle: number,
  getCycle: (entry: T) => number,
  getValue: (entry: T) => U,
  defaultValue: U
) => {
  const prevEntry = entries.find(entry => getCycle(entry) < cycle);

  return prevEntry ? getValue(prevEntry) : defaultValue;
};

export const BakerRewardsList = memo(() => {
  const selectedBaker = useSelectedBakerSelector();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const accountPkh = useCurrentAccountPkhSelector();

  const styles = useBakerRewardsListStyles();

  const getBakingHistory = useCallback(
    async ([, accountPkh, , selectedRpcUrl]: [string, string, string | nullish, string]) => {
      const [rewards, cycles, protocol] = await Promise.all([
        getDelegatorRewards(selectedRpcUrl, { address: accountPkh, limit: 30 }).then(res => res || []),
        getCycles(selectedRpcUrl),
        getProtocol(selectedRpcUrl)
      ]);
      const bakersAddresses = uniq(rewards.map(({ baker }) => baker.address));
      const setParamsOperationsValues = await Promise.all(
        bakersAddresses.map(address =>
          fetchSetDelegateParametersOperations(selectedRpcUrl, { sender: address, 'sort.desc': 'level' })
        )
      );
      const storiesValues = await Promise.all(bakersAddresses.map(address => bakingBadGetBakerStory({ address })));

      return {
        rewards,
        cycles: Object.fromEntries(cycles.map(cycle => [cycle.index, cycle])),
        protocol,
        setParamsOperations: Object.fromEntries(
          bakersAddresses.map((address, i) => [address, setParamsOperationsValues[i]])
        ),
        stories: Object.fromEntries(bakersAddresses.map((address, i) => [address, storiesValues[i]]))
      };
    },
    []
  );

  const { data: bakingHistoryInput, isLoading } = useSWR(
    ['baking-history', accountPkh, selectedBaker?.address, selectedRpcUrl],
    getBakingHistory,
    { suspense: true, errorRetryCount: 2 }
  );

  const bakingHistory = useMemo(() => {
    const { rewards, cycles, protocol, setParamsOperations, stories } = bakingHistoryInput!;

    const nowDate = new Date().toISOString();
    const currentCycleIndex = Object.values(cycles).find(
      ({ startTime, endTime }) => startTime <= nowDate && endTime > nowDate
    )!.index;

    return rewards.map((reward): BakingHistoryEntry => {
      const { cycle: cycleIndex, baker } = reward;
      const { address: bakerAddress, alias: bakerName } = baker;
      const cycle = cycles[cycleIndex];
      const bakerSetParamsOperations = setParamsOperations[bakerAddress];
      const { delegationMinBalance: minDelegationStory, delegationFee: delegationFeeStory } =
        stories[bakerAddress] ?? FALLBACK_STORY;

      const { limitOfStakingOverBaking, edgeOfBakingOverStaking } = getCycleValue<
        TzktSetDelegateParamsOperation,
        Record<'limitOfStakingOverBaking' | 'edgeOfBakingOverStaking', number>
      >(bakerSetParamsOperations, cycleIndex, op => op.activationCycle, identity, {
        limitOfStakingOverBaking: 0,
        edgeOfBakingOverStaking: 1e9
      });
      const delegationFee = getCycleValue(
        delegationFeeStory,
        cycleIndex,
        ({ cycle }) => cycle,
        ({ value }) => value,
        0
      );
      const minDelegation = getCycleValue(
        minDelegationStory,
        cycleIndex,
        ({ cycle }) => cycle,
        ({ value }) => value,
        0
      );

      return {
        ...getRewardsStats({
          rewardsEntry: reward,
          cycle,
          protocol,
          limitOfStakingOverBaking,
          edgeOfBakingOverStaking,
          delegationFee,
          minDelegation
        }),
        bakerAddress,
        bakerName,
        status:
          cycleIndex > currentCycleIndex
            ? CycleStatus.FUTURE
            : cycleIndex === currentCycleIndex
            ? CycleStatus.IN_PROGRESS
            : CycleStatus.UNLOCKED
      };
    });
  }, [bakingHistoryInput]);

  const renderItem: ListRenderItem<BakingHistoryEntry> = useCallback(({ item }) => <BakerRewardItem item={item} />, []);

  const ListEmptyComponent = useMemo(() => <DataPlaceholder text="No Rewards records were found" />, []);

  return (
    <>
      <View style={styles.rewardsContainer}>
        <Text style={styles.rewardsText}>Rewards</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <FlashList
          data={bakingHistory}
          contentContainerStyle={styles.flatListContentContainer}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={AVERAGE_ITEM_HEIGHT}
          ListEmptyComponent={ListEmptyComponent}
        />
      )}
    </>
  );
});
