import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { Divider } from '../divider/divider';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useAttentionMessageStyles } from './attention-message.styles';

interface Props {
  title?: string;
  iconName?: IconNameEnum;
}

export const AttentionMessage: FC<Props> = ({ children, title, iconName = IconNameEnum.Alert }) => {
  const styles = useAttentionMessageStyles();

  return (
    <View style={styles.container}>
      <Icon name={iconName} />
      <Divider size={formatSize(8)} />
      <View style={styles.content}>
        {isDefined(title) && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </View>
  );
};
