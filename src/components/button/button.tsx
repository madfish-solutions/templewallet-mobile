import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { conditionalStyle } from '../../utils/conditional-style';
import { isDefined } from '../../utils/is-defined';
import { setTestID } from '../../utils/test-id.utils';
import { Icon } from '../icon/icon';
import { ButtonSharedProps } from './button-shared.props';
import { ButtonStyleConfig } from './button-style.config';
import { ButtonStyles } from './button.styles';

interface Props extends ButtonSharedProps {
  styleConfig: ButtonStyleConfig;
  isFullWidth?: boolean;
}

export const Button: FC<Props> = ({
  title,
  iconName,
  disabled = false,
  styleConfig,

  isFullWidth = false,

  marginTop,
  marginRight,
  marginBottom,
  marginLeft,

  onPress,

  testID
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
    <View style={conditionalStyle(isFullWidth, ButtonStyles.container)}>
      <TouchableOpacity
        disabled={disabled}
        style={[
          ButtonStyles.touchableOpacity,
          containerStyle,
          { backgroundColor, borderColor },
          { marginTop, marginRight, marginBottom, marginLeft }
        ]}
        onPress={onPress}
        {...setTestID(testID)}
      >
        {isDefined(iconName) && (
          <Icon
            name={iconName}
            size={iconStyle?.size}
            color={iconColor}
            {...(isDefined(title) && { style: { marginRight: iconStyle?.marginRight } })}
          />
        )}

        <Text style={[titleStyle, { color: titleColor }]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};
