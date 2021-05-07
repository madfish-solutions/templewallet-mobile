import React, { FC } from 'react';

import { IconNameEnum } from '../../icon/icon-name.enum';
import { Button } from '../button';
import { ButtonSharedProps } from '../button-shared.props';
import { buttonMediumStyleConfig } from './button-medium.styles';

interface Props extends ButtonSharedProps {
  title: string;
  iconName: IconNameEnum;
}

export const ButtonMedium: FC<Props> = props => <Button {...props} styleConfig={buttonMediumStyleConfig} />;
