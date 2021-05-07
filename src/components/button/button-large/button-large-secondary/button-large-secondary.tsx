import React, { FC } from 'react';

import { Button } from '../../button';
import { ButtonSharedProps } from '../../button-shared.props';
import { buttonLargeSecondaryStyleConfig } from './button-large-secondary.styles';

interface Props extends ButtonSharedProps {
  title: string;
}

export const ButtonLargeSecondary: FC<Props> = props => (
  <Button {...props} styleConfig={buttonLargeSecondaryStyleConfig} />
);
