import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { conditionalStyle } from '../../../../utils/conditional-style';
import { ScreensEnum } from '../../../enums/screens.enum';
import { useNavigation } from '../../../hooks/use-navigation.hook';
import { useSideBarButtonStyles } from './side-bar-button.styles';

interface Props {
  label: string;
  iconName: IconNameEnum;
  routeName: ScreensEnum;
  focused: boolean;
  disabled?: boolean;
}

export const SideBarButton: FC<Props> = ({ label, iconName, routeName, focused, disabled = false }) => {
  const colors = useColors();
  const styles = useSideBarButtonStyles();
  const { navigate } = useNavigation();

  const color = useMemo(() => {
    let value = colors.gray1;
    focused && (value = colors.orange);
    disabled && (value = colors.disabled);

    return value;
  }, [colors, focused, disabled]);

  return (
    <TouchableOpacity
      style={[styles.container, conditionalStyle(focused, { borderLeftColor: color })]}
      disabled={disabled}
      onPress={() => navigate(routeName)}>
      <Icon name={iconName} size={formatSize(28)} color={color} />
      <Divider size={formatSize(8)} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};
