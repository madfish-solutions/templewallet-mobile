import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { useDebugTapListener } from '../../../hooks/use-debug-tap-listener';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { ScreensEnum } from '../../enums/screens.enum';
import { useNavigation } from '../../hooks/use-navigation.hook';
import { useTabBarButtonStyles } from './tab-bar-button.styles';

interface Props {
  label: string;
  iconName: IconNameEnum;
  iconWidth: number;
  routeName: ScreensEnum;
  focused: boolean;
  disabled?: boolean;
  shouldOpenDebug?: boolean;
}

export const TabBarButton: FC<Props> = ({
  label,
  iconName,
  iconWidth,
  routeName,
  focused,
  disabled = false,
  shouldOpenDebug
}) => {
  const colors = useColors();
  const styles = useTabBarButtonStyles();
  const { navigate } = useNavigation();
  const { onTap } = useDebugTapListener();

  const color = useMemo(() => {
    let value = colors.gray1;
    focused && (value = colors.orange);
    disabled && (value = colors.disabled);

    return value;
  }, [colors, focused, disabled]);

  const handlePress = () => {
    navigate(routeName);
    shouldOpenDebug && onTap();
  };

  return (
    <TouchableOpacity style={styles.container} disabled={disabled} onPress={handlePress}>
      <Icon name={iconName} width={iconWidth} height={formatSize(28)} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};
