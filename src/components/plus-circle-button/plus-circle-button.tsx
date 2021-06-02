import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { EmptyFn } from '../../config/general';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { usePlusCircleButtonStyles } from './plus-circle-button.styles';

interface Props {
  text: string;
  onPress: EmptyFn;
}

export const PlusCircleButton: FC<Props> = ({ text, onPress }) => {
  const styles = usePlusCircleButtonStyles();

  return (
    <TouchableOpacity style={styles.touchableOpacity} onPress={onPress}>
      <Icon name={IconNameEnum.PlusCircle} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
