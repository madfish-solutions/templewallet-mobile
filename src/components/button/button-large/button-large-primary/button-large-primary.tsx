import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonSharedProps } from '../../button-shared.props';
import { useButtonLargePrimaryStyleConfig } from './button-large-primary.styles';

interface Props extends ButtonSharedProps {
  title: string;
}

export const ButtonLargePrimary: FC<Props> = props => {
  const styleConfig = useButtonLargePrimaryStyleConfig();

  return <Button {...props} styleConfig={styleConfig} />;
};
