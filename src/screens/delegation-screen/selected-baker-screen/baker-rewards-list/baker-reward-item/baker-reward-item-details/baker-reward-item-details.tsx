import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../../../../components/divider/divider';
import { Icon } from '../../../../../../components/icon/icon';
import { IconNameEnum } from '../../../../../../components/icon/icon-name.enum';
import { BakerRewardInterface } from '../../../../../../interfaces/baker-reward.interface';
import { formatSize } from '../../../../../../styles/format-size';
import { mutezToTz } from '../../../../../../utils/tezos.util';
import { useBakerRewardItemStyles } from '../baker-reward-item.styles';

interface Props {
  reward: BakerRewardInterface;
}

export const BakerRewardItemDetails: FC<Props> = ({ reward }) => {
  const styles = useBakerRewardItemStyles();

  const {
    ownBlockRewards,
    endorsementRewards,
    ownBlocks,
    endorsements,
    ownBlockFees,
    missedEndorsementRewards,
    missedOwnBlockFees,
    missedOwnBlockRewards,
    missedOwnBlocks,
    missedEndorsements
  } = reward;

  return (
    <>
      {ownBlocks > 0 && (
        <>
          <Divider size={formatSize(26)} />
          <View style={styles.row}>
            <Divider size={formatSize(26)} />
            <View style={styles.column}>
              <View style={styles.detailTitleContainer}>
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
                    +
                    {mutezToTz(new BigNumber(ownBlockRewards), 6).decimalPlaces(2, BigNumber.ROUND_FLOOR).toString() +
                      ' '}
                    TEZ
                    <Text style={styles.textGray}>
                      {' '}
                      for <Text style={styles.textBlack}>{ownBlocks.toString()} blocks</Text>
                    </Text>
                  </Text>
                  <Divider size={formatSize(2)} />
                  <Text style={styles.textBlack}>
                    +
                    {mutezToTz(new BigNumber(ownBlockFees), 6).decimalPlaces(2, BigNumber.ROUND_FLOOR).toString() + ' '}
                    TEZ
                    <Text style={styles.textGray}> fees</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      {endorsements > 0 && (
        <>
          <Divider size={formatSize(26)} />
          <View style={styles.row}>
            <Divider size={formatSize(26)} />
            <View style={styles.column}>
              <View style={styles.detailTitleContainer}>
                <Icon name={IconNameEnum.Endorsements} size={formatSize(24)} />
                <Divider size={formatSize(4)} />
                <Text style={styles.detailTitle}>Endorsements</Text>
              </View>
              <Divider size={formatSize(8)} />
              <View style={styles.row}>
                <Divider size={formatSize(28)} />
                <View style={styles.column}>
                  <Text style={styles.cellTitle}>Payout:</Text>
                  <Divider size={formatSize(2)} />
                  <Text style={styles.textGreen}>
                    +
                    {mutezToTz(new BigNumber(endorsementRewards), 6)
                      .decimalPlaces(2, BigNumber.ROUND_FLOOR)
                      .toString() + ' '}
                    TEZ
                    <Text style={styles.textGray}>
                      {' '}
                      for <Text style={styles.textBlack}>{endorsements.toString()} slots</Text>
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      {missedOwnBlocks > 0 && (
        <>
          <Divider size={formatSize(26)} />
          <View style={styles.row}>
            <Divider size={formatSize(26)} />
            <View style={styles.column}>
              <View style={styles.detailTitleContainer}>
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
                    -
                    {mutezToTz(new BigNumber(missedOwnBlockRewards), 6)
                      .decimalPlaces(2, BigNumber.ROUND_FLOOR)
                      .toString() + ' '}
                    TEZ
                    <Text style={styles.textGray}>
                      {' '}
                      for <Text style={styles.textBlack}>{missedOwnBlocks.toString()} blocks</Text>
                    </Text>
                  </Text>
                  <Divider size={formatSize(2)} />
                  <Text style={styles.textBlack}>
                    -
                    {mutezToTz(new BigNumber(missedOwnBlockFees), 6)
                      .decimalPlaces(2, BigNumber.ROUND_FLOOR)
                      .toString() + ' '}
                    TEZ
                    <Text style={styles.textGray}> fees</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}

      {missedEndorsements > 0 && (
        <>
          <Divider size={formatSize(26)} />
          <View style={styles.row}>
            <Divider size={formatSize(26)} />
            <View style={styles.column}>
              <View style={styles.detailTitleContainer}>
                <Icon name={IconNameEnum.MissedEndorsements} size={formatSize(24)} />
                <Divider size={formatSize(4)} />
                <Text style={styles.detailTitle}>Missed endorsements</Text>
              </View>
              <Divider size={formatSize(8)} />
              <View style={styles.row}>
                <Divider size={formatSize(28)} />
                <View style={styles.column}>
                  <Text style={styles.cellTitle}>Payout:</Text>
                  <Divider size={formatSize(2)} />
                  <Text style={styles.textRed}>
                    -
                    {mutezToTz(new BigNumber(missedEndorsementRewards), 6)
                      .decimalPlaces(2, BigNumber.ROUND_FLOOR)
                      .toString() + ' '}
                    TEZ
                    <Text style={styles.textGray}>
                      {' '}
                      for <Text style={styles.textBlack}>{missedEndorsements.toString()} slots</Text>
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};
