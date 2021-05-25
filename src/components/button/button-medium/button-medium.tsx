import React, { FC } from 'react';

import { IconNameEnum } from '../../icon/icon-name.enum';
import { Button } from '../button';
import { ButtonSharedProps } from '../button-shared.props';
import { useButtonMediumStyleConfig } from './button-medium.styles';

interface Props extends ButtonSharedProps {
  title: string;
  iconName: IconNameEnum;
}

export const ButtonMedium: FC<Props> = props => {
  const styleConfig = useButtonMediumStyleConfig();

  return <Button {...props} styleConfig={styleConfig} isFullWidth={true} />;
};
