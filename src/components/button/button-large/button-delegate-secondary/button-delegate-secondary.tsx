import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonLargeProps } from '../button-large.props';
import { useButtonDelegateSecondaryStyleConfig } from './button-delegate-secondary.styles';

export const ButtonDelegateSecondary: FC<ButtonLargeProps> = props => {
  const styleConfig = useButtonDelegateSecondaryStyleConfig();

  return <Button {...props} styleConfig={styleConfig} isFullWidth={true} />;
};
