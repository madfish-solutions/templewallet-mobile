import React, { FC } from 'react';

import { EmptyFn } from '../../../config/general';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { TouchableIcon } from '../../icon/touchable-icon/touchable-icon';
import { HeaderButtonStyles } from './header-button.styles';

interface Props {
  iconName: IconNameEnum;
  onPress: EmptyFn;
  color?: string;
}

export const HeaderButton: FC<Props> = ({ iconName, color, onPress }) => (
  <TouchableIcon name={iconName} style={HeaderButtonStyles.icon} color={color} onPress={onPress} />
);
