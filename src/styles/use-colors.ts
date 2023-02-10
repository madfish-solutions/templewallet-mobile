import { useMemo } from 'react';

import { useThemeSelector } from 'src/store/settings/settings-selectors';

import { getColors } from './colors';

export const useColors = () => {
  const theme = useThemeSelector();

  return useMemo(() => getColors(theme), [theme]);
};
