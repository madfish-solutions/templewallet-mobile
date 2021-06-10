import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { ScreensEnum } from '../../screens.enum';
import { useNavigation } from '../../use-navigation.hook';
import { useTabBarButtonStyles } from './tab-bar-button.styles';

interface Props {
  label: string;
  iconName: IconNameEnum;
  iconWidth: number;
  routeName: ScreensEnum;
  focused: boolean;
  disabled?: boolean;
}

export const TabBarButton: FC<Props> = ({
  label,
  iconName,
  iconWidth,
  routeName,
  focused,
  disabled = false
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

  return (
    <TouchableOpacity style={styles.container} disabled={disabled} onPress={() => navigate(routeName)}>
      <Icon name={iconName} width={iconWidth} height={formatSize(28)} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};
