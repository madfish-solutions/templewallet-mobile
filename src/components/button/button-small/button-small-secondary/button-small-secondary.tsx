import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonSmallProps } from '../button-small.props';

import { useButtonSmallSecondaryStyles } from './button-small-secondary.styles';

export const ButtonSmallSecondary: FC<ButtonSmallProps> = props => {
  const styleConfig = useButtonSmallSecondaryStyles();

  return <Button {...props} styleConfig={styleConfig} />;
};
