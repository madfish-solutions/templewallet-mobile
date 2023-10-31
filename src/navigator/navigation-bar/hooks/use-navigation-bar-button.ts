import { useCallback, useMemo } from 'react';

import { emptyFn } from 'src/config/general';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useColors } from 'src/styles/use-colors';

import { NavigationBarButton } from '../interfaces/navigation-bar-button.interface';

export const useNavigationBarButton = ({
  focused,
  routeName,
  swapScreenParams,
  disabled = false,
  disabledOnPress = emptyFn
}: Omit<NavigationBarButton, 'iconWidth'>) => {
  const colors = useColors();
  const { navigate } = useNavigation();

  const color = useMemo(() => {
    let value = colors.gray1;
    focused && (value = colors.orange);
    disabled && (value = colors.disabled);

    return value;
  }, [colors, focused, disabled]);

  const handlePress = useCallback(() => {
    if (disabled) {
      disabledOnPress();
    } else {
      if (routeName === ScreensEnum.SwapScreen) {
        navigate(routeName, swapScreenParams);
      } else {
        navigate(routeName);
      }
    }
  }, [disabled, disabledOnPress, navigate, routeName, swapScreenParams]);

  return {
    color,
    colors,
    handlePress
  };
};
