import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonSharedProps } from '../../button-shared.props';
import { useButtonDelegateSecondaryStyleConfig } from './button-delegate-secondary.styles';

interface Props extends ButtonSharedProps {
  title: string;
}

export const ButtonDelegateSecondary: FC<Props> = props => {
  const styleConfig = useButtonDelegateSecondaryStyleConfig();

  return <Button {...props} styleConfig={styleConfig} isFullWidth={true} />;
};
