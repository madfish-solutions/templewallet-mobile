import React from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { Divider } from '../divider/divider';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { IconV2 } from '../icon-v2';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum.ts';

import { useAttentionMessageStyles } from './attention-message.styles';

interface Props {
  title?: string;
  iconName?: IconNameEnum;
  iconNameV2?: IconNameV2Enum;
}

export const AttentionMessage: FCWithChildren<Props> = ({
  children,
  title,
  iconName = IconNameEnum.Alert,
  iconNameV2
}) => {
  const styles = useAttentionMessageStyles();

  return (
    <View style={styles.container}>
      {iconNameV2 ? <IconV2 name={iconNameV2} /> : <Icon name={iconName} />}
      <Divider size={formatSize(8)} />
      <View style={styles.content}>
        {isDefined(title) && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </View>
  );
};
