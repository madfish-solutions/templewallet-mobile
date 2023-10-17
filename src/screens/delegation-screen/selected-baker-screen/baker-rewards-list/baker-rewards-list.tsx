import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { BakerRewardInterface } from 'src/interfaces/baker-reward.interface';

import { BakerRewardItem } from './baker-reward-item/baker-reward-item';
import { useBakerRewardsListStyles } from './baker-rewards-list.styles';
import { reduceFunction } from './utils/reduce-function';

type RewardsPerEventHistoryItem = Partial<
  Record<
    'rewardPerOwnBlock' | 'rewardPerEndorsement' | 'rewardPerFutureBlock' | 'rewardPerFutureEndorsement',
    BigNumber
  >
>;

const allRewardsPerEventKeys: (keyof RewardsPerEventHistoryItem)[] = [
  'rewardPerOwnBlock',
  'rewardPerEndorsement',
  'rewardPerFutureBlock',
  'rewardPerFutureEndorsement'
];

interface Props {
  bakerRewards: BakerRewardInterface[];
}

const keyExtractor = (item: BakerRewardInterface) => item.cycle.toString();

export const BakerRewardsList: FC<Props> = ({ bakerRewards }) => {
  const styles = useBakerRewardsListStyles();

  const rewardsPerEventHistory = useMemo(
    () =>
      bakerRewards.map(historyItem => {
        const {
          endorsements,
          endorsementRewards,
          futureBlocks,
          futureBlockRewards,
          futureEndorsements,
          futureEndorsementRewards,
          ownBlocks,
          ownBlockRewards
        } = historyItem;
        const rewardPerOwnBlock = ownBlocks === 0 ? undefined : new BigNumber(ownBlockRewards).div(ownBlocks);
        const rewardPerEndorsement =
          endorsements === 0 ? undefined : new BigNumber(endorsementRewards).div(endorsements);
        const rewardPerFutureBlock =
          futureBlocks === 0 ? undefined : new BigNumber(futureBlockRewards).div(futureBlocks);
        const rewardPerFutureEndorsement =
          futureEndorsements === 0 ? undefined : new BigNumber(futureEndorsementRewards).div(futureEndorsements);

        return {
          rewardPerOwnBlock,
          rewardPerEndorsement,
          rewardPerFutureBlock,
          rewardPerFutureEndorsement
        };
      }),
    [bakerRewards]
  );

  const fallbackRewardsPerEvents = useMemo(() => {
    return rewardsPerEventHistory.map(historyItem =>
      allRewardsPerEventKeys.reduce(
        (fallbackRewardsItem, key, index) => {
          return reduceFunction(fallbackRewardsItem, key, index, historyItem, rewardsPerEventHistory);
        },
        {
          rewardPerOwnBlock: new BigNumber(0),
          rewardPerEndorsement: new BigNumber(0),
          rewardPerFutureBlock: new BigNumber(0),
          rewardPerFutureEndorsement: new BigNumber(0)
        }
      )
    );
  }, [rewardsPerEventHistory]);

  const currentCycle = useMemo(
    () =>
      bakerRewards?.find(({ extraBlockRewards, endorsementRewards, ownBlockRewards, ownBlockFees, extraBlockFees }) => {
        const totalCurrentRewards = new BigNumber(extraBlockRewards)
          .plus(endorsementRewards)
          .plus(ownBlockRewards)
          .plus(ownBlockFees)
          .plus(extraBlockFees);

        return totalCurrentRewards.gt(0);
      })?.cycle,
    [bakerRewards]
  );

  const renderItem: ListRenderItem<BakerRewardInterface> = useCallback(
    ({ item, index }) => (
      <BakerRewardItem
        currentCycle={currentCycle}
        key={`${item.cycle},${item.baker.address}`}
        reward={item}
        fallbackRewardPerEndorsement={fallbackRewardsPerEvents[index].rewardPerEndorsement}
        fallbackRewardPerFutureBlock={fallbackRewardsPerEvents[index].rewardPerFutureBlock}
        fallbackRewardPerFutureEndorsement={fallbackRewardsPerEvents[index].rewardPerFutureEndorsement}
        fallbackRewardPerOwnBlock={fallbackRewardsPerEvents[index].rewardPerOwnBlock}
      />
    ),
    [currentCycle, fallbackRewardsPerEvents]
  );

  const ListEmptyComponent = useMemo(() => <DataPlaceholder text="No Rewards records were found" />, []);

  return (
    <>
      <View style={styles.rewardsContainer}>
        <Text style={styles.rewardsText}>Rewards</Text>
      </View>

      <FlashList
        data={bakerRewards}
        contentContainerStyle={styles.flatListContentContainer}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};
