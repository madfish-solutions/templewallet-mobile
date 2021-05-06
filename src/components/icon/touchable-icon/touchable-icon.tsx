import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { EmptyFn } from '../../../config/general';
import { step } from '../../../config/styles';
import { Icon, IconProps } from '../icon';
import { TouchableIconStyles } from './touchable-icon.styles';

interface Props extends IconProps {
  iconSize?: number;
  onPress: EmptyFn;
}

export const TouchableIcon: FC<Props> = ({ size = 3 * step, glyph, iconSize, color, onPress }) => (
  <TouchableOpacity style={[TouchableIconStyles.container, { width: size, height: size }]} onPress={onPress}>
    <Icon glyph={glyph} size={iconSize} color={color} />
  </TouchableOpacity>
);
