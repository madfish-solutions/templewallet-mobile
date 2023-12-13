import React, { FC, useMemo } from 'react';

import { ThemesEnum } from 'src/interfaces/theme.enum';
import { useThemeSelector } from 'src/store/settings/settings-selectors';

import { Icon, IconProps } from './icon';
import { IconNameEnum } from './icon-name.enum';

export const LogoWithText: FC<Omit<IconProps, 'name'>> = props => {
  const theme = useThemeSelector();

  const logoIconName = useMemo(
    () => (theme === ThemesEnum.dark ? IconNameEnum.TempleLogoWithTextDark : IconNameEnum.TempleLogoWithTextLight),
    [theme]
  );

  return <Icon name={logoIconName} {...props} />;
};
