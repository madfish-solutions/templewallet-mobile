import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { conditionalStyle } from 'src/utils/conditional-style';

import { useTabBarButtonStyles } from './tab-bar-button.styles';

interface Props {
  label: string;
  iconName: IconNameEnum;
  iconWidth: number;
  routeName:
    | ScreensEnum.Wallet
    | ScreensEnum.DApps
    | ScreensEnum.SwapScreen
    | ScreensEnum.Market
    | ScreensEnum.CollectiblesHome;
  focused: boolean;
  disabled?: boolean;
  showNotificationDot?: boolean;
  swapScreenParams?: ScreensParamList[ScreensEnum.SwapScreen];
  disabledOnPress?: EmptyFn;
}

export const TabBarButton = memo<Props>(
  ({
    label,
    iconName,
    iconWidth,
    routeName,
    focused,
    disabled = false,
    showNotificationDot = false,
    swapScreenParams,
    disabledOnPress
  }) => {
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
          {showNotificationDot && (
            <Icon
              name={IconNameEnum.NotificationDot}
              width={formatSize(9)}
              height={formatSize(9)}
              color={colors.navigation}
              style={styles.notificationDotIcon}
            />
          )}
          <Icon name={iconName} width={iconWidth} height={formatSize(28)} color={color} />
        </View>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </SafeTouchableOpacity>
    );
  }
);
