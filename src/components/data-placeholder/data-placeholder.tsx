import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';

import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { useDataPlaceholderStyles } from './data-placeholder.styles';

interface Props {
  text: string;
  subText?: string;
}

export const DataPlaceholder: FC<Props> = ({ text, subText }) => {
  const styles = useDataPlaceholderStyles();

  return (
    <View style={styles.container}>
      <Icon name={IconNameEnum.NoResult} size={formatSize(120)} />
      <Text style={[styles.text, styles.mb12]}>{text}</Text>
      {subText !== undefined && <Text style={styles.text}>{subText}</Text>}
    </View>
  );
};
