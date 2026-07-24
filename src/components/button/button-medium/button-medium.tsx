import React, { FC, useMemo } from 'react';

import { Button, ButtonProps, ButtonV2 } from '../button';
import { ButtonSharedProps } from '../button-shared.props';
import { ButtonStyleConfig } from '../button-style.config';

import { useButtonMediumStyleConfig, useButtonMediumStyleConfigV2 } from './button-medium.styles';

interface Props<IconName extends string, Size extends number> extends ButtonSharedProps<IconName> {
  title: string;
  iconName: IconName;
  styleConfigOverrides?: Partial<ButtonStyleConfig<Size>>;
}

// TODO: Get rid of ButtonMediumHOC when ButtonMedium is not used anymore
const ButtonMediumHOC = <IconName extends string, Size extends number>(
  ButtonComponent: FC<ButtonProps<IconName, Size>>,
  useStyleConfig: () => ButtonStyleConfig<Size>
) => {
  const ButtonMedium: FC<Props<IconName, Size>> = ({ styleConfigOverrides, ...rest }) => {
    const defaultStyleConfig = useStyleConfig();

    const styleConfig = useMemo(
      () => ({
        ...defaultStyleConfig,
        ...styleConfigOverrides
      }),
      [defaultStyleConfig, styleConfigOverrides]
    );

    return <ButtonComponent {...rest} styleConfig={styleConfig} isFullWidth={true} />;
  };

  return ButtonMedium;
};

/** @deprecated Use ButtonMediumV2 instead */
export const ButtonMedium = ButtonMediumHOC(Button, useButtonMediumStyleConfig);

export const ButtonMediumV2 = ButtonMediumHOC(ButtonV2, useButtonMediumStyleConfigV2);
