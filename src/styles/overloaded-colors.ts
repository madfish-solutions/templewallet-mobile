import { useMemo } from 'react';

import {
  dAppsStackScreens,
  ScreensEnum,
  settingsStackScreens,
  swapStackScreens,
  walletStackScreens
} from '../navigator/enums/screens.enum';
import { useThemeSelector } from '../store/settings/settings-selectors';
import { Colors, getColors } from './colors';

type OverloadedColor = {
  [key in keyof Colors]: Colors[key];
};

export const useOverloadedColors = () => {
  const theme = useThemeSelector();

  return useMemo(() => {
    const colors = getColors(theme);

    const allScreens: Array<ScreensEnum> = [
      ...dAppsStackScreens,
      ...settingsStackScreens,
      ...swapStackScreens,
      ...walletStackScreens
    ];

    const defaultScreenColors: Record<ScreensEnum, OverloadedColor> = allScreens.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc: any, screen) => ({ ...acc, [screen]: colors }),
      {}
    );

    const screensWithOverload = {
      ...defaultScreenColors,
      [ScreensEnum.KolibriDapp]: {
        ...colors,
        orange: colors.kolibriGreen
      }
    };

    return screensWithOverload;
  }, [theme]);
};
