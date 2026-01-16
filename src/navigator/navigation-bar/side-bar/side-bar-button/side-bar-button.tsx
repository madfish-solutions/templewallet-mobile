import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { conditionalStyle } from 'src/utils/conditional-style';

import { useSideBarButtonStyles } from './side-bar-button.styles';

interface Props {
  label: string;
  iconName: IconNameEnum;
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
  showNotificationDot = false,
  swapScreenParams,
  disabledOnPress
}) => {
  const colors = useColors();
  const styles = useSideBarButtonStyles();
  const { navigate } = useNavigation();

  const color = useMemo(() => {
    let value = colors.gray1;
    focused && (value = colors.orange);
    disabled && (value = colors.disabled);

    return value;
  }, [colors, focused, disabled]);

  const handlePress = () => {
    if (disabled) {
      disabledOnPress?.();
    } else {
      if (routeName === ScreensEnum.SwapScreen) {
        navigate(routeName, swapScreenParams);
      } else {
        navigate(routeName);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        conditionalStyle(focused, { borderLeftColor: color }),
        conditionalStyle(disabled, { borderLeftColor: color })
      ]}
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
        <Icon name={iconName} size={formatSize(28)} color={color} />
      </View>
      <Divider size={formatSize(8)} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};
