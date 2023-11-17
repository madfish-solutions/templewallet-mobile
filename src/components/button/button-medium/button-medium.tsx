import React, { FC, useMemo } from 'react';

import { IconNameEnum } from '../../icon/icon-name.enum';
import { Button } from '../button';
import { ButtonSharedProps } from '../button-shared.props';
import { ButtonStyleConfig } from '../button-style.config';

import { useButtonMediumStyleConfig } from './button-medium.styles';

interface Props extends ButtonSharedProps {
  title: string;
  iconName: IconNameEnum;
  styleConfigOverrides?: Partial<ButtonStyleConfig>;
}

export const ButtonMedium: FC<Props> = ({ styleConfigOverrides, ...rest }) => {
  const defaultStyleConfig = useButtonMediumStyleConfig();

  const styleConfig = useMemo(
    () => ({
      ...defaultStyleConfig,
      ...styleConfigOverrides
    }),
    [defaultStyleConfig, styleConfigOverrides]
  );

  return <Button {...rest} styleConfig={styleConfig} isFullWidth={true} />;
};
