import React from 'react';

import { Button } from '../button';
import { ButtonSharedProps } from '../button-shared.props';
import { useButtonSmallStyles } from './button-small.styles';

interface Props extends Omit<ButtonSharedProps, 'iconName'> {
  title: string;
}

export const ButtonSmall: React.FC<Props> = props => {
  const styleConfig = useButtonSmallStyles();

  return <Button {...props} styleConfig={styleConfig} />;
};
