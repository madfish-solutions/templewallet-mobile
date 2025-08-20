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

export const MissedEndorsements: FC<
  Pick<BakerRewardInterface['bakerRewards'], 'missedAttestations' | 'missedAttestationRewards'>
> = ({ missedAttestations, missedAttestationRewards }) => {
  const styles = useBakerRewardItemStyles();
  const { metadata } = useNetworkInfo();

  return (
    <>
      <Divider size={formatSize(26)} />
      <View style={styles.row}>
        <Divider size={formatSize(26)} />
        <View style={styles.column}>
          <View style={styles.rowAlignCenter}>
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
                {mutezToTz(new BigNumber(missedAttestationRewards), 6)
                  .decimalPlaces(2, BigNumber.ROUND_FLOOR)
                  .toString() + ' '}
                {metadata.symbol}
                <Text style={styles.textGray}>
                  {' '}
                  for <Text style={styles.textBlack}>{missedAttestations.toString()} slots</Text>
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
