import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonSmallProps } from '../button-small.props';

import { useButtonSmallTryAgainStyles } from './button-small-try-again.styles';

export const ButtonSmallTryAgain: FC<ButtonSmallProps> = props => {
  const styleConfig = useButtonSmallTryAgainStyles();

  return <Button {...props} styleConfig={styleConfig} />;
};
