import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { EmptyFn, emptyFn } from '../../../../config/general';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { ScreensEnum, ScreensParamList } from '../../../enums/screens.enum';
import { useNavigation } from '../../../hooks/use-navigation.hook';
import { useSideBarButtonStyles } from './side-bar-button.styles';

interface Props {
  label: string;
  iconName: IconNameEnum;
  routeName: ScreensEnum;
  focused: boolean;
  disabled?: boolean;
  showNotificationDot?: boolean;
  params?: ScreensParamList[ScreensEnum.SwapScreen];
  onSwapButtonPress?: EmptyFn;
  disabledOnPress?: EmptyFn;
}

export const SideBarButton: FC<Props> = ({
  label,
  iconName,
  routeName,
  focused,
  disabled = false,
  showNotificationDot = false,
  params,
  onSwapButtonPress,
  disabledOnPress = emptyFn
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
      disabledOnPress();
    } else {
      if (onSwapButtonPress) {
        onSwapButtonPress();
      } else {
        // @ts-ignore
        navigate(routeName, params);
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
