import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useDataPlaceholderStyles } from './data-placeholder.styles';

interface Props {
  text: string;
}

export const DataPlaceholder: FC<Props> = ({ text }) => {
  const styles = useDataPlaceholderStyles();

  return (
    <View style={styles.container}>
      <Icon name={IconNameEnum.NoResult} size={formatSize(120)} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
