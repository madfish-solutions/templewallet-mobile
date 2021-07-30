import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { GestureResponderEvent } from 'react-native';

import { EventFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { generateHitSlop } from '../../../styles/generate-hit-slop';
import { Icon, IconProps } from '../icon';
import { TouchableIconStyles } from './touchable-icon.styles';

interface Props extends IconProps {
  onPress: EventFn<GestureResponderEvent>;
}

export const TouchableIcon: FC<Props> = ({ size = formatSize(24), name, color, style, onPress }) => (
  <TouchableOpacity
    style={[TouchableIconStyles.container, { width: size, height: size }, style]}
    hitSlop={generateHitSlop(formatSize(4))}
    onPress={onPress}>
    <Icon name={name} size={size} color={color} />
  </TouchableOpacity>
);
