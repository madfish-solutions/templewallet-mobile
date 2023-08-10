import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { Divider } from 'src/components/divider/divider';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { useBakerByAddressSelector } from 'src/store/baking/baking-selectors';
import { formatSize } from 'src/styles/format-size';
import { truncateLongAddress } from 'src/utils/exolix.util';
import { isDefined } from 'src/utils/is-defined';

import { useActivityCommonStyles, useActivityGroupItemStyles } from '../activity-group-item.styles';

export const Delegation: FC<{ address: string | undefined }> = ({ address = '' }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  const baker = useBakerByAddressSelector(address);

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      {isDefined(baker) ? (
        <AvatarImage size={formatSize(36)} uri={baker.logo} />
      ) : (
        <RobotIcon size={formatSize(36)} seed={address} style={styles.robotBackground} />
      )}

      <Divider size={formatSize(10)} />
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationTitle}>Delegate</Text>
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationSubtitle}>To: {baker?.name ?? truncateLongAddress(address)}</Text>
        </View>
      </View>
    </View>
  );
};
