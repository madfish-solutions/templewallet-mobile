import React, { FC } from 'react';

import { TestIdProps } from 'src/interfaces/test-id.props';

import { IconNameEnum } from '../../icon/icon-name.enum';
import { TouchableIcon } from '../../icon/touchable-icon/touchable-icon';

import { HeaderButtonStyles } from './header-button.styles';

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  onPress: EmptyFn;
  color?: string;
}

export const HeaderButton: FC<Props> = ({ iconName, color, onPress, testID }) => (
  <TouchableIcon name={iconName} style={HeaderButtonStyles.icon} color={color} onPress={onPress} testID={testID} />
);
