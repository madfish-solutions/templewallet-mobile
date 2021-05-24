import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonLargeProps } from '../button-large.props';
import { useButtonLargeSecondaryStyleConfig } from './button-large-secondary.styles';

export const ButtonLargeSecondary: FC<ButtonLargeProps> = props => {
  const styleConfig = useButtonLargeSecondaryStyleConfig();

  return <Button {...props} styleConfig={styleConfig} />;
};
