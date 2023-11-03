import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ActivityGroup } from '../../../../interfaces/activity.interface';
import { formatSize } from '../../../../styles/format-size';
import { Divider } from '../../../divider/divider';
import { Icon } from '../../../icon/icon';

import { useActivityGroupTypeStyles } from './activity-group-type.styles';
import { useActivityGroupInfo } from './use-activity-group-info.hook';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupType: FC<Props> = ({ group }) => {
  const styles = useActivityGroupTypeStyles();

  const [iconName, iconColor, typeText] = useActivityGroupInfo(group);

  return (
    <View style={styles.container}>
      <Icon name={iconName} color={iconColor} />
      <Divider size={formatSize(4)} />
      <Text style={styles.text}>{typeText}</Text>
    </View>
  );
};
