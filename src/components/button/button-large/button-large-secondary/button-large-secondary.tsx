import React, { FC } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

import { Button } from '../../button';
import { ButtonStyleConfig } from '../../button-style.config';
import { ButtonLargeProps } from '../button-large.props';

import { useButtonLargeSecondaryStyleConfig } from './button-large-secondary.styles';

interface Props extends ButtonLargeProps {
  activeColorStyleConfig?: ButtonStyleConfig['activeColorConfig'];
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const ButtonLargeSecondary: FC<Props> = ({
  activeColorStyleConfig,
  textStyle,
  buttonStyle,
  style,
  ...props
}) => {
  const styleConfig = useButtonLargeSecondaryStyleConfig();

  const finalStyleConfig = activeColorStyleConfig
    ? {
        ...styleConfig,
        activeColorConfig: activeColorStyleConfig
      }
    : styleConfig;

  return (
    <Button
      {...props}
      styleConfig={finalStyleConfig}
      isFullWidth={true}
      textStyle={textStyle}
      buttonStyle={buttonStyle}
      style={style}
    />
  );
};
