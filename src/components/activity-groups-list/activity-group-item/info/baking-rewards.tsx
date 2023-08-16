import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { Divider } from 'src/components/divider/divider';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { useBakerByAddressSelector } from 'src/store/baking/baking-selectors';
import { formatSize } from 'src/styles/format-size';
import { calculateDollarValue } from 'src/utils/activity.utils';
import { truncateLongAddress } from 'src/utils/address.utils';
import { isDefined } from 'src/utils/is-defined';

import { ActivityGroupAmountChange } from '../activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from '../activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityCommonStyles, useActivityGroupItemStyles } from '../activity-group-item.styles';

export const BakingRewards: FC<{ address: string; nonZeroAmounts: Array<ActivityAmount> }> = ({
  address,
  nonZeroAmounts
}) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  const baker = useBakerByAddressSelector(address);

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      {isDefined(baker) && isDefined(baker.logo) ? (
        <AvatarImage size={formatSize(36)} uri={baker.logo} />
      ) : (
        <RobotIcon size={formatSize(36)} seed={address} style={styles.robotBackground} />
      )}
      <Divider size={formatSize(10)} />
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationTitle}>Baking rewards</Text>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationSubtitle}>From: {baker?.name ?? truncateLongAddress(address)}</Text>
          <ActivityGroupDollarAmountChange dollarValue={calculateDollarValue(nonZeroAmounts)} />
        </View>
      </View>
    </View>
  );
};
