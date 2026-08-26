import React, { FC } from 'react';

import { IconV2Props } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TouchableIconV2 } from 'src/components/touchable-icon-v2';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';

import { HeaderButtonStyles } from './header-button.styles';

interface Props extends TestIdProps {
  iconName: IconNameV2Enum;
  onPress: EmptyFn;
  color?: string;
  style?: IconV2Props['style'];
  iconSize?: IconV2Props['size'];
  size?: number;
}

export const HeaderButton: FC<Props> = ({
  iconName,
  color,
  onPress,
  testID,
  style,
  iconSize = 24,
  size = formatSize(24)
}) => (
  <TouchableIconV2
    name={iconName}
    style={[HeaderButtonStyles.icon, style]}
    color={color}
    iconSize={iconSize}
    size={size}
    onPress={onPress}
    testID={testID}
  />
);
