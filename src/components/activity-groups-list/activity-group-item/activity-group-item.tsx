import React, { FC } from 'react';
import { View } from 'react-native';

import { useNonZeroAmounts } from '../../../hooks/use-non-zero-amounts.hook';
import { ActivityGroup, emptyActivity } from '../../../interfaces/activity.interface';
import { formatSize } from '../../../styles/format-size';
import { tzktUrl } from '../../../utils/linking.util';
import { Divider } from '../../divider/divider';
import { ExternalLinkButton } from '../../icon/external-link-button/external-link-button';
import { PublicKeyHashText } from '../../public-key-hash-text/public-key-hash-text';
import { ActivityGroupAmountChange } from './activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from './activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityGroupItemStyles } from './activity-group-item.styles';
import { ActivityGroupType } from './activity-group-type/activity-group-type';
import { ActivityStatusBadge } from './activity-status-badge/activity-status-badge';
import { ActivityTime } from './activity-time/activity-time';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupItem: FC<Props> = ({ group }) => {
  const styles = useActivityGroupItemStyles();
  const nonZeroAmounts = useNonZeroAmounts(group);

  const firstActivity = group[0] ?? emptyActivity;

  return (
    <View style={styles.container}>
      <Divider size={formatSize(8)} />
      <View style={styles.upperContainer}>
        <ActivityGroupType group={group} />

        <View style={styles.exploreContainer}>
          <PublicKeyHashText publicKeyHash={firstActivity.hash} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(firstActivity.hash)} />
        </View>
      </View>
      <Divider size={formatSize(8)} />
      <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
      <Divider size={formatSize(4)} />
      <View style={styles.lowerContainer}>
        <View style={styles.statusContainer}>
          <ActivityStatusBadge status={firstActivity.status} />
          <Divider size={formatSize(4)} />
          <ActivityTime timestamp={firstActivity.timestamp} />
        </View>

        <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
      </View>
      <Divider size={formatSize(16)} />
    </View>
  );
};
