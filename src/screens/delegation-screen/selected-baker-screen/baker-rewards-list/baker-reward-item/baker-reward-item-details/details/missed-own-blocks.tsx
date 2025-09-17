import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { formatSize } from 'src/styles/format-size';

import { BakingHistoryEntry } from '../../../interfaces/baking-history-entry';
import { useBakerRewardItemStyles } from '../../baker-reward-item.styles';

export const MissedOwnBlocks: FC<
  Pick<BakingHistoryEntry, 'missedBlockFees' | 'missedBlockRewards' | 'missedBlocks'>
> = ({ missedBlockFees, missedBlockRewards, missedBlocks }) => {
  const styles = useBakerRewardItemStyles();
  const { metadata } = useNetworkInfo();

  return (
    <>
      <Divider size={formatSize(26)} />
      <View style={styles.row}>
        <Divider size={formatSize(26)} />
        <View style={styles.column}>
          <View style={styles.rowAlignCenter}>
            <Icon name={IconNameEnum.MissedOwnBlocks} size={formatSize(24)} />
            <Divider size={formatSize(4)} />
            <Text style={styles.detailTitle}>Missed Own Blocks</Text>
          </View>
          <Divider size={formatSize(8)} />
          <View style={styles.row}>
            <Divider size={formatSize(28)} />
            <View style={styles.column}>
              <Text style={styles.cellTitle}>Payout:</Text>
              <Divider size={formatSize(2)} />
              <Text style={styles.textRed}>
                -{missedBlockRewards.decimalPlaces(2, BigNumber.ROUND_FLOOR).toString() + ' '}
                {metadata.symbol}
                <Text style={styles.textGray}>
                  {' '}
                  for <Text style={styles.textBlack}>{missedBlocks.toString()} blocks</Text>
                </Text>
              </Text>
              <Divider size={formatSize(2)} />
              <Text style={styles.textBlack}>
                -{missedBlockFees.decimalPlaces(2, BigNumber.ROUND_FLOOR).toString() + ' '}
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
