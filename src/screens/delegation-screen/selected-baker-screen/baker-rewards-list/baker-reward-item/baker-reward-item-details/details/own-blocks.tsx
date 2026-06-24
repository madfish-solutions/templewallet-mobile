import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_SYMBOL } from 'src/token/data/tokens-metadata';

import { BakingHistoryEntry } from '../../../interfaces/baking-history-entry';
import { useBakerRewardItemStyles } from '../../baker-reward-item.styles';

export const OwnBlocks: FC<Pick<BakingHistoryEntry, 'blocks' | 'blockRewards' | 'blockFees'>> = ({
  blocks,
  blockRewards,
  blockFees
}) => {
  const styles = useBakerRewardItemStyles();

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
                +{blockRewards.decimalPlaces(2, BigNumber.ROUND_FLOOR).toString() + ' '}
                {TEZ_TOKEN_SYMBOL}
                <Text style={styles.textGray}>
                  {' '}
                  for <Text style={styles.textBlack}>{blocks.toString()} blocks</Text>
                </Text>
              </Text>
              <Divider size={formatSize(2)} />
              <Text style={styles.textBlack}>
                +{blockFees.decimalPlaces(2, BigNumber.ROUND_FLOOR).toString() + ' '}
                {TEZ_TOKEN_SYMBOL}
                <Text style={styles.textGray}> fees</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
