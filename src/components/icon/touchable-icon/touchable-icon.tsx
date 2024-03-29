import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { isAndroid } from 'src/config/system';
import { formatSize } from 'src/styles/format-size';
import { generateHitSlop } from 'src/styles/generate-hit-slop';

import { Icon, IconProps } from '../icon';

import { TouchableIconStyles } from './touchable-icon.styles';

interface Props extends IconProps {
  disabled?: boolean;
  onPress: EmptyFn;
}

export const TouchableIcon: FC<Props> = ({
  size = formatSize(24),
  name,
  color,
  style,
  disabled,
  testID,
  testIDProperties,
  onPress
}) => (
  <TouchableWithAnalytics
    Component={TouchableOpacity}
    style={[TouchableIconStyles.container, { width: size, height: size }, style]}
    disabled={disabled}
    hitSlop={generateHitSlop(formatSize(4))}
    {...(isAndroid && { disallowInterruption: true })}
    onPress={onPress}
    testID={testID}
    testIDProperties={testIDProperties}
  >
    <Icon name={name} size={size} color={color} />
  </TouchableWithAnalytics>
);
