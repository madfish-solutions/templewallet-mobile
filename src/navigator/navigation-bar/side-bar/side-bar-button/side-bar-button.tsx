import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';

import { NavigationBarIcon } from '../../navigation-bar-icon';
import { NavigationBarIconNameEnum } from '../../navigation-bar-icon/icon-name.enum';
import { useNavigationBarColors } from '../../use-navigation-bar-colors';

import { useSideBarButtonStyles } from './side-bar-button.styles';

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
  showNotificationDot?: boolean;
  swapScreenParams?: ScreensParamList[ScreensEnum.SwapScreen];
  disabledOnPress?: EmptyFn;
}

export const SideBarButton: FC<Props> = ({
  label,
  iconName,
  routeName,
  focused,
  disabled = false,
  swapScreenParams,
  disabledOnPress
}) => {
  const styles = useSideBarButtonStyles();
  const navigateToScreen = useNavigateToScreen({ pop: true });

  const { iconColor, labelColor } = useNavigationBarColors(focused, disabled);

  const handlePress = () => {
    if (disabled) {
      disabledOnPress?.();
    } else {
      if (routeName === ScreensEnum.SwapScreen) {
        navigateToScreen({ screen: routeName, params: swapScreenParams });
      } else {
        navigateToScreen({ screen: routeName });
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        conditionalStyle(focused, { borderLeftColor: iconColor }),
        conditionalStyle(disabled, { borderLeftColor: iconColor })
      ]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <NavigationBarIcon name={iconName} color={iconColor} />
      </View>
      <Divider size={formatSize(8)} />
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};
