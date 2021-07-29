import { useMemo } from 'react';

import { useThemeSelector } from '../store/settings/settings-selectors';
import { getColors } from './colors';

export const useColors = () => {
  const theme = useThemeSelector();

  return useMemo(() => getColors(theme), [theme]);
};
