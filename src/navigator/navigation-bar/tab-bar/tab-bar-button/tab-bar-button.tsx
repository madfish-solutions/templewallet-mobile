import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { useColors } from 'src/styles/use-colors';
import { conditionalStyle } from 'src/utils/conditional-style';

import { NavigationBarIcon } from '../../navigation-bar-icon';
import { NavigationBarIconNameEnum } from '../../navigation-bar-icon/icon-name.enum';

import { useTabBarButtonStyles } from './tab-bar-button.styles';

interface Props {
  label: string;
  iconName: NavigationBarIconNameEnum;
  routeName:
    | ScreensEnum.Wallet
    | ScreensEnum.DApps
    | ScreensEnum.SwapScreen
    | ScreensEnum.Market
    | ScreensEnum.CollectiblesHome;
  focused: boolean;
  disabled?: boolean;
  swapScreenParams?: ScreensParamList[ScreensEnum.SwapScreen];
  disabledOnPress?: EmptyFn;
}

export const TabBarButton = memo<Props>(
  ({ label, iconName, routeName, focused, disabled = false, swapScreenParams, disabledOnPress }) => {
    const colors = useColors();
    const styles = useTabBarButtonStyles();
    const navigateToScreen = useNavigateToScreen();

    const color = useMemo(() => {
      let value = colors.gray1;
      focused && (value = colors.orange);
      disabled && (value = colors.disabled);

      return value;
    }, [colors, focused, disabled]);

    const handlePress = () => {
      if (disabled) {
        return void disabledOnPress?.();
      }

      if (routeName === ScreensEnum.SwapScreen) {
        navigateToScreen({ screen: routeName, params: swapScreenParams });
      } else {
        navigateToScreen({ screen: routeName });
      }
    };

    return (
      <SafeTouchableOpacity
        style={[styles.container, conditionalStyle(disabled, { borderLeftColor: color })]}
        onPress={handlePress}
      >
        <View style={styles.iconContainer}>
          <NavigationBarIcon name={iconName} color={color} />
        </View>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </SafeTouchableOpacity>
    );
  }
);
