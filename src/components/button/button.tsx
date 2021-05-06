import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, ReactElement } from 'react';
import { Pressable, Text } from 'react-native';
import { EmptyFn } from '../../config/general';

interface Props {
  title: string;
  disabled: boolean;
  icon: ReactElement;
  onPress: EmptyFn;
}

export const Button: FC<Props> = ({ title, disabled, icon, onPress }) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      {icon}
      <Text>{title}</Text>
    </TouchableOpacity>
  )
};
