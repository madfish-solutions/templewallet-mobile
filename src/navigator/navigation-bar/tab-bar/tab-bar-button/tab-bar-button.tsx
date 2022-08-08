import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { EmptyFn, emptyFn } from '../../../../config/general';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { ScreensEnum, ScreensParamList } from '../../../enums/screens.enum';
import { useNavigation } from '../../../hooks/use-navigation.hook';
import { useTabBarButtonStyles } from './tab-bar-button.styles';

interface Props {
  label: string;
  iconName: IconNameEnum;
  iconWidth: number;
  routeName: ScreensEnum;
  focused: boolean;
  disabled?: boolean;
  params?: ScreensParamList[ScreensEnum.SwapScreen];
  disabledOnPress?: EmptyFn;
}

export const TabBarButton: FC<Props> = ({
  label,
  iconName,
  iconWidth,
  routeName,
  focused,
  disabled = false,
  params,
  disabledOnPress = emptyFn
}) => {
  const colors = useColors();
  const styles = useTabBarButtonStyles();
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
      navigate(routeName, params);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, conditionalStyle(disabled, { borderLeftColor: color })]}
      onPress={handlePress}
    >
      <Icon name={iconName} width={iconWidth} height={formatSize(28)} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};
