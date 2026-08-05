import React from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { Divider } from '../divider/divider';
import { IconV2 } from '../icon-v2';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum.ts';

import { useAttentionMessageStyles } from './attention-message.styles';

interface Props {
  title?: string;
  iconName?: IconNameV2Enum;
}

export const AttentionMessage: FCWithChildren<Props> = ({
  children,
  title,
  iconName = IconNameV2Enum.AlarmTriangle
}) => {
  const styles = useAttentionMessageStyles();

  return (
    <View style={styles.container}>
      <IconV2 name={iconName} />
      <Divider size={formatSize(8)} />
      <View style={styles.content}>
        {isDefined(title) && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </View>
  );
};
