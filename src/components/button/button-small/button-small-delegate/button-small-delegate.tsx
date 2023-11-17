import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonSmallProps } from '../button-small.props';

import { useButtonSmallDelegateStyles } from './button-small-delegate.styles';

export const ButtonSmallDelegate: FC<ButtonSmallProps> = props => {
  const styleConfig = useButtonSmallDelegateStyles();

  return <Button {...props} styleConfig={styleConfig} />;
};
