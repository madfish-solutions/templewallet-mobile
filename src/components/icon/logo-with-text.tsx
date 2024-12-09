import React, { memo } from 'react';

import { ThemesEnum } from 'src/interfaces/theme.enum';
import { useThemeSelector } from 'src/store/settings/settings-selectors';

import { Icon, IconProps } from './icon';
import { IconNameEnum } from './icon-name.enum';

export const LogoWithText = memo<Omit<IconProps, 'name'>>(props => {
  const theme = useThemeSelector();

  const logoIconName =
    theme === ThemesEnum.dark ? IconNameEnum.TempleLogoWithTextDark : IconNameEnum.TempleLogoWithTextLight;

  return <Icon name={logoIconName} {...props} />;
});
