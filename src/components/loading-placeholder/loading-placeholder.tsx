import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { useLoadingPlaceholderStyles } from './loading-placeholder.styles';

interface Props {
  text: string;
}

export const LoadingPlaceholder: FC<Props> = ({ text }) => {
  const styles = useLoadingPlaceholderStyles();

  return (
    <View style={styles.container}>
      <Icon name={IconNameEnum.HourGlasses} size={formatSize(120)} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
