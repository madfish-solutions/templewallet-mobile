import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useNetworkInfo } from 'src/hooks/use-network-info.hook';

import { Divider } from '../../../../../../../components/divider/divider';
import { Icon } from '../../../../../../../components/icon/icon';
import { IconNameEnum } from '../../../../../../../components/icon/icon-name.enum';
import { BakerRewardInterface } from '../../../../../../../interfaces/baker-reward.interface';
import { formatSize } from '../../../../../../../styles/format-size';
import { mutezToTz } from '../../../../../../../utils/tezos.util';
import { useBakerRewardItemStyles } from '../../baker-reward-item.styles';

export const OwnBlocks: FC<
  Pick<
    BakerRewardInterface['bakerRewards'],
    | 'blocks'
    | 'blockRewardsDelegated'
    | 'blockRewardsStakedEdge'
    | 'blockRewardsStakedOwn'
    | 'blockRewardsStakedShared'
    | 'blockFees'
  >
> = ({
  blocks,
  blockRewardsDelegated,
  blockRewardsStakedEdge,
  blockRewardsStakedOwn,
  blockRewardsStakedShared,
  blockFees
}) => {
  const ownBlockRewards = new BigNumber(blockRewardsDelegated)
    .plus(blockRewardsStakedEdge)
    .plus(blockRewardsStakedOwn)
    .plus(blockRewardsStakedShared);

  const styles = useBakerRewardItemStyles();
  const { metadata } = useNetworkInfo();

  return (
    <>
      <Divider size={formatSize(26)} />
      <View style={styles.row}>
        <Divider size={formatSize(26)} />
        <View style={styles.column}>
          <View style={styles.rowAlignCenter}>
            <Icon name={IconNameEnum.OwnBlocks} size={formatSize(24)} />
            <Divider size={formatSize(4)} />
            <Text style={styles.detailTitle}>Own Blocks</Text>
          </View>
          <Divider size={formatSize(8)} />
          <View style={styles.row}>
            <Divider size={formatSize(28)} />
            <View style={styles.column}>
              <Text style={styles.cellTitle}>Payout:</Text>
              <Divider size={formatSize(2)} />
              <Text style={styles.textGreen}>
                +{mutezToTz(ownBlockRewards, 6).decimalPlaces(2, BigNumber.ROUND_FLOOR).toString() + ' '}
                {metadata.symbol}
                <Text style={styles.textGray}>
                  {' '}
                  for <Text style={styles.textBlack}>{blocks.toString()} blocks</Text>
                </Text>
              </Text>
              <Divider size={formatSize(2)} />
              <Text style={styles.textBlack}>
                +{mutezToTz(new BigNumber(blockFees), 6).decimalPlaces(2, BigNumber.ROUND_FLOOR).toString() + ' '}
                {metadata.symbol}
                <Text style={styles.textGray}> fees</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
