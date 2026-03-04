import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { ActivityGroup } from 'src/interfaces/activity.interface';
import { formatSize } from 'src/styles/format-size';

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
