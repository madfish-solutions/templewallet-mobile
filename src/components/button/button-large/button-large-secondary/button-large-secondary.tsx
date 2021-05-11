import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonSharedProps } from '../../button-shared.props';
import { useButtonLargeSecondaryStyleConfig } from './button-large-secondary.styles';

interface Props extends ButtonSharedProps {
  title: string;
}

export const ButtonLargeSecondary: FC<Props> = props => {
  const styleConfig = useButtonLargeSecondaryStyleConfig();

  return <Button {...props} styleConfig={styleConfig} />;
};
