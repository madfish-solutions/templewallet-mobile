import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { EmptyFn } from '../../config/general';
import { black } from '../../config/styles';
import { ButtonStyles } from './button.styles';

interface Props {
  title: string;
  color?: string;
  onPress: EmptyFn;
}

export const Button: FC<Props> = ({ title, color = black, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[ButtonStyles.title, { color }]}>{title}</Text>
  </TouchableOpacity>
);
