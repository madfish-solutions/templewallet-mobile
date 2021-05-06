import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { black } from '../../../config/styles';
import { DeprecatedButtonStyles } from './deprecated-button.styles';

interface Props {
  title: string;
  color?: string;
  onPress: EmptyFn;
}

export const DeprecatedButton: FC<Props> = ({ title, color = black, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={[DeprecatedButtonStyles.title, { color }]}>{title}</Text>
  </TouchableOpacity>
);
