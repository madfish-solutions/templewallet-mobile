import React from 'react';

import { IconNameEnum } from '../../icon/icon-name.enum';
import { Button } from '../button';
import { ButtonSharedProps } from '../button-shared.props';
import { useButtonSmallStyles } from './button-small.styles';

interface Props extends ButtonSharedProps {
  title: string;
  iconName?: IconNameEnum;
}

export function ButtonSmall(props: Props) {
  const styleConfig = useButtonSmallStyles();

  return <Button {...props} styleConfig={styleConfig} />;
}
