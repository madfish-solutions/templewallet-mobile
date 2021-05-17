import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { Icon } from '../icon/icon';
import { ButtonSharedProps } from './button-shared.props';
import { ButtonStyleConfig } from './button-style.config';
import { ButtonStyles } from './button.styles';

interface Props extends ButtonSharedProps {
  styleConfig: ButtonStyleConfig;
}

export const Button: FC<Props> = ({
  title,
  iconName,
  disabled,
  styleConfig,

  marginTop,
  marginRight,
  marginBottom,
  marginLeft,

  onPress
}) => {
  const {
    containerStyle,
    titleStyle,
    iconStyle,
    activeColorConfig,
    disabledColorConfig = activeColorConfig
  } = styleConfig;
  const {
    titleColor,
    iconColor = titleColor,
    backgroundColor,
    borderColor = backgroundColor
  } = disabled ? disabledColorConfig : activeColorConfig;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        ButtonStyles.containerStyle,
        containerStyle,
        { backgroundColor, borderColor },
        { marginTop, marginRight, marginBottom, marginLeft }
      ]}
      onPress={onPress}>
      {isDefined(iconName) && (
        <Icon
          name={iconName}
          size={iconStyle.size}
          color={iconColor}
          {...(isDefined(title) && { style: { marginRight: iconStyle.marginRight } })}
        />
      )}

      <Text style={[titleStyle, { color: titleColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};
