import { FC } from 'react';

import { isAndroid } from 'src/config/system';
import { formatSize } from 'src/styles/format-size';
import { generateHitSlop } from 'src/styles/generate-hit-slop';

import { IconV2, IconV2Props } from '../icon-v2';
import { SafeTouchableOpacity } from '../safe-touchable-opacity';
import { TouchableWithAnalytics } from '../touchable-with-analytics';

import { TouchableIconStyles } from './styles';

interface Props extends Omit<IconV2Props, 'size'> {
  size?: number;
  iconSize?: IconV2Props['size'];
  disabled?: boolean;
  onPress: EmptyFn;
}

export const TouchableIconV2: FC<Props> = ({
  size = formatSize(28),
  iconSize = 12,
  style,
  disabled,
  testID,
  testIDProperties,
  onPress,
  name,
  color
}) => (
  <TouchableWithAnalytics
    Component={SafeTouchableOpacity}
    style={[TouchableIconStyles.container, { width: size, height: size }, style]}
    disabled={disabled}
    hitSlop={generateHitSlop(formatSize(4))}
    {...(isAndroid && { disallowInterruption: true })}
    onPress={onPress}
    testID={testID}
    testIDProperties={testIDProperties}
  >
    <IconV2 name={name} size={iconSize} color={color} />
  </TouchableWithAnalytics>
);
