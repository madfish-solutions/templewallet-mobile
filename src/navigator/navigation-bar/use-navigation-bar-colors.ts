import { useMemo } from 'react';

import { useColors } from 'src/styles/use-colors';

export const useNavigationBarColors = (focused: boolean, disabled: boolean) => {
  const colors = useColors();

  return useMemo(() => {
    let value = { iconColor: colors.gray2, labelColor: colors.gray1 };
    focused && (value = { iconColor: colors.orange, labelColor: colors.orange });
    disabled && (value = { iconColor: colors.disabled, labelColor: colors.disabled });

    return value;
  }, [colors, focused, disabled]);
};
