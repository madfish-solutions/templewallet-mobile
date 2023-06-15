import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonStyleConfig } from '../../button-style.config';
import { ButtonLargeProps } from '../button-large.props';
import { useButtonLargeSecondaryStyleConfig } from './button-large-secondary.styles';

interface Props extends ButtonLargeProps {
  activeColorStyleConfig?: ButtonStyleConfig['activeColorConfig'];
}

export const ButtonLargeSecondary: FC<Props> = props => {
  const styleConfig = useButtonLargeSecondaryStyleConfig();

  const finalStyleConfig = props.activeColorStyleConfig
    ? {
        ...styleConfig,
        activeColorConfig: props.activeColorStyleConfig
      }
    : styleConfig;

  return <Button {...props} styleConfig={finalStyleConfig} isFullWidth={true} />;
};
