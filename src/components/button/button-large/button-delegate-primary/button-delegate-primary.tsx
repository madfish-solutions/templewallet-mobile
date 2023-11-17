import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonLargeProps } from '../button-large.props';

import { useButtonDelegatePrimaryStyleConfig } from './button-delegate-primary.styles';

export const ButtonDelegatePrimary: FC<ButtonLargeProps> = props => {
  const styleConfig = useButtonDelegatePrimaryStyleConfig();

  return <Button {...props} styleConfig={styleConfig} isFullWidth={true} />;
};
