import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonSharedProps } from '../../button-shared.props';
import { useButtonDelegatePrimaryStyleConfig } from './button-delegate-primary.styles';

interface Props extends ButtonSharedProps {
  title: string;
}

export const ButtonDelegatePrimary: FC<Props> = props => {
  const styleConfig = useButtonDelegatePrimaryStyleConfig();

  return <Button {...props} styleConfig={styleConfig} />;
};
