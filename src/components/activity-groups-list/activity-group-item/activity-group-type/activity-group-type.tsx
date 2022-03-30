import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ActivityGroup } from '../../../../interfaces/activity.interface';
import { useSelectedAccountSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { Divider } from '../../../divider/divider';
import { Icon } from '../../../icon/icon';
import { useActivityGroupTypeStyles } from './activity-group-type.styles';
import { handleChooseIcon, IconGroupType } from './activity-group-type.util';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupType: FC<Props> = ({ group }) => {
  const colors = useColors();
  const styles = useActivityGroupTypeStyles();

  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;

  const [iconName, iconColor, typeText] = useMemo<IconGroupType>(
    () => handleChooseIcon(group, colors, publicKeyHash),
    [group, publicKeyHash, colors]
  );

  return (
    <View style={styles.container}>
      <Icon name={iconName} color={iconColor} />
      <Divider size={formatSize(4)} />
      <Text style={styles.text}>{typeText}</Text>
    </View>
  );
};
