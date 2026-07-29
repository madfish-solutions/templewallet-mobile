import { useMemo } from 'react';

import { useColors } from 'src/styles/use-colors';

export const useNavigationBarColors = (focused: boolean, disabled: boolean) => {
  const colors = useColors();

  return useMemo(() => {
    if (focused) {
      return { iconColor: colors.orange, labelColor: colors.orange };
    }

    if (disabled) {
      return { iconColor: colors.disabled, labelColor: colors.disabled };
    }

    return { iconColor: colors.gray2, labelColor: colors.gray1 };
  }, [colors, focused, disabled]);
};
