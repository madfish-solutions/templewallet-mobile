import React, { FC } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

import { Button } from '../../button';
import { ButtonLargeProps } from '../button-large.props';
import { useButtonLargePrimaryStyleConfig } from './button-large-primary.styles';

interface Props extends ButtonLargeProps {
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const ButtonLargePrimary: FC<Props> = ({ buttonStyle, style, textStyle, ...props }) => {
  const styleConfig = useButtonLargePrimaryStyleConfig();

  return (
    <Button
      {...props}
      styleConfig={styleConfig}
      isFullWidth={true}
      buttonStyle={buttonStyle}
      textStyle={textStyle}
      style={style}
    />
  );
};
