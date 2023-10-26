import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { EmptyFn } from '../../config/general';
import { TestIdProps } from '../../interfaces/test-id.props';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { useIconTitleNoBgStyles } from './icon-title-no-bg.styles';

interface Props extends TestIdProps {
  text: string;
  icon: IconNameEnum;
  onPress: EmptyFn;
}

export const IconTitleNoBg: FC<Props> = ({ text, icon, onPress, testID }) => {
  const styles = useIconTitleNoBgStyles();

  return (
    <TouchableOpacity style={styles.touchableOpacity} onPress={onPress} testID={testID}>
      <Icon name={icon} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
