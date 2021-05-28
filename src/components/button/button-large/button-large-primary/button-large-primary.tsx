import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonLargeProps } from '../button-large.props';
import { useButtonLargePrimaryStyleConfig } from './button-large-primary.styles';

export const ButtonLargePrimary: FC<ButtonLargeProps> = props => {
  const styleConfig = useButtonLargePrimaryStyleConfig();

  return <Button {...props} styleConfig={styleConfig} isFullWidth={true} />;
};
