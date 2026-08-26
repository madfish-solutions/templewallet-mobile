import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { conditionalStyle } from 'src/utils/conditional-style';

import { NavigationBarIcon } from '../../navigation-bar-icon';
import { NavigationBarIconNameEnum } from '../../navigation-bar-icon/icon-name.enum';
import { useNavigationBarColors } from '../../use-navigation-bar-colors';

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
    const styles = useTabBarButtonStyles();
    const navigateToScreen = useNavigateToScreen({ pop: true });

    const { iconColor, labelColor } = useNavigationBarColors(focused, disabled);

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
      <TouchableOpacity
        style={[styles.container, conditionalStyle(disabled, { borderLeftColor: iconColor })]}
        onPress={handlePress}
      >
        <View style={styles.iconContainer}>
          <NavigationBarIcon name={iconName} color={iconColor} />
        </View>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      </TouchableOpacity>
    );
  }
);
