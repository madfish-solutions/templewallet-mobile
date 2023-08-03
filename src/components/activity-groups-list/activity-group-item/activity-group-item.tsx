import { Activity, ActivityType } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { BakerInterface } from 'src/apis/baking-bad';
import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { Divider } from 'src/components/divider/divider';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { ActivityGroup, emptyActivity } from 'src/interfaces/activity.interface';
import { useBakersListSelector } from 'src/store/baking/baking-selectors';
import { formatSize } from 'src/styles/format-size';
import { truncateLongAddress } from 'src/utils/exolix.util';
import { isDefined } from 'src/utils/is-defined';

import { ActivityGroupAmountChange } from './activity-group-amount-change/activity-group-amount-change';
import { ActivityDetails } from './activity-group-details';
import { ActivityGroupDollarAmountChange } from './activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityCommonStyles, useActivityGroupItemStyles } from './activity-group-item.styles';

interface Props {
  group: ActivityGroup;
}

const nonZeroAmounts = {
  amounts: [{ parsedAmount: new BigNumber(888), isPositive: true, exchangeRate: 1.2, symbol: 'XTZ' }],
  dollarSums: [new BigNumber(888)]
};

const findBaker = (bakers: Array<BakerInterface>, candidate: string) =>
  bakers.find(baker => baker.address === candidate);

const GetActivityItem: FC<{ activity: Activity }> = ({ activity }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();
  const bakers = useBakersListSelector();

  switch (activity.type) {
    case ActivityType.Recieve:
      return (
        <View style={[commonStyles.row, commonStyles.itemsCenter]}>
          <RobotIcon size={formatSize(36)} seed={activity.from.address} style={styles.robotBackground} />
          <Divider size={formatSize(10)} />
          <View style={styles.flex}>
            <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={styles.oprationTitle}>Receive</Text>
              <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
            </View>
            <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={styles.oprationSubtitle}>From: {truncateLongAddress(activity.from.address)}</Text>
              <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
            </View>
          </View>
        </View>
      );
    case ActivityType.Send:
      return (
        <View style={[commonStyles.row, commonStyles.itemsCenter]}>
          <RobotIcon size={formatSize(36)} seed={activity.to.address} style={styles.robotBackground} />
          <Divider size={formatSize(10)} />
          <View style={styles.flex}>
            <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={styles.oprationTitle}>Send</Text>
              <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
            </View>
            <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={styles.oprationSubtitle}>To: {truncateLongAddress(activity.to.address)}</Text>
              <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
            </View>
          </View>
        </View>
      );
    case ActivityType.BakingRewards: {
      const baker = findBaker(bakers, activity.from.address);

      return (
        <View style={[commonStyles.row, commonStyles.itemsCenter]}>
          {isDefined(baker) ? (
            <AvatarImage size={formatSize(36)} uri={baker.logo} />
          ) : (
            <RobotIcon
              size={formatSize(36)}
              seed={activity.to?.address ?? activity.hash}
              style={styles.robotBackground}
            />
          )}
          <Divider size={formatSize(10)} />
          <View style={styles.flex}>
            <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={styles.oprationTitle}>Baking rewards</Text>
              <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
            </View>
            <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={styles.oprationSubtitle}>
                From: {baker?.name ?? truncateLongAddress(activity.from.address)}
              </Text>
              <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
            </View>
          </View>
        </View>
      );
    }
    case ActivityType.Delegation: {
      const baker = findBaker(bakers, activity.to?.address ?? '');

      return (
        <View style={[commonStyles.row, commonStyles.itemsCenter]}>
          {isDefined(baker) ? (
            <AvatarImage size={formatSize(36)} uri={baker.logo} />
          ) : (
            <RobotIcon
              size={formatSize(36)}
              seed={activity.to?.address ?? activity.hash}
              style={styles.robotBackground}
            />
          )}

          <Divider size={formatSize(10)} />
          <View style={styles.flex}>
            <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={styles.oprationTitle}>Delegate</Text>
              <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
            </View>
            <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
              <Text style={styles.oprationSubtitle}>
                To: {baker?.name ?? truncateLongAddress(activity.to?.address ?? '')}
              </Text>
              <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
            </View>
          </View>
        </View>
      );
    }

    default:
      return null;
  }
};

export const ActivityGroupItem: FC<Props> = ({ group }) => {
  const styles = useActivityGroupItemStyles();
  const firstActivity = group[0] ?? emptyActivity;

  return (
    <View style={styles.root}>
      <GetActivityItem activity={firstActivity} />
      <Divider size={formatSize(12)} />
      <ActivityDetails activity={firstActivity} />
    </View>
  );
};
