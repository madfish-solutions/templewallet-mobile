import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonLargeProps } from '../button-large.props';
import { useButtonLargeWhiteStyleConfig } from './button-large-white.styles';

export const ButtonLargeWhite: FC<ButtonLargeProps> = props => {
  const styleConfig = useButtonLargeWhiteStyleConfig();

  return <Button {...props} styleConfig={styleConfig} isFullWidth={true} />;
};
