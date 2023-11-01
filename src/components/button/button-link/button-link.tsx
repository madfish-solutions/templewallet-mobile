import React, { FC } from 'react';

import { Button } from '../button';
import { ButtonSharedProps } from '../button-shared.props';

import { useButtonLinkStyles } from './button-link.styles';

interface Props extends Omit<ButtonSharedProps, 'iconName'> {
  title: string;
}

export const ButtonLink: FC<Props> = props => {
  const styleConfig = useButtonLinkStyles();

  return <Button {...props} styleConfig={styleConfig} />;
};
