import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { EmptyFn } from '../../../config/general';
import { step } from '../../../config/styles';
import { Icon, IconProps } from '../icon';
import { TouchableIconStyles } from './touchable-icon.styles';

interface Props extends IconProps {
  onPress: EmptyFn;
}

export const TouchableIcon: FC<Props> = ({ size = 3 * step, name, color, onPress, style }) => (
  <TouchableOpacity style={[TouchableIconStyles.container, { width: size, height: size }, style]} onPress={onPress}>
    <Icon name={name} size={size} color={color} />
  </TouchableOpacity>
);
