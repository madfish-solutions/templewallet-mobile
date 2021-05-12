import React from 'react';

import { Button } from '../button';
import { ButtonSharedProps } from '../button-shared.props';
import { useButtonSmallStyles } from './button-small.styles';

interface Props extends Omit<ButtonSharedProps, 'iconName'> {
  title: string;
}

export function ButtonSmall(props: Props) {
  const styleConfig = useButtonSmallStyles();

  return <Button {...props} styleConfig={styleConfig} />;
}
