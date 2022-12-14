import React, { FC } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { useHiddenButtonStyles } from './hidden-button.styles';

interface Props {
  text: string;
  iconName: IconNameEnum;
  fill?: string;
  disabled?: boolean;
  onPress: () => void;
}

export const HiddenButton: FC<Props> = ({ text, iconName, fill, disabled = false, onPress }) => {
  const colors = useColors();
  const styles = useHiddenButtonStyles();

  const fillColor = disabled ? colors.disabled : fill;
  const iconStyles = disabled ? styles.iconDisabled : styles.iconActive;
  const textStyles = disabled ? styles.textDisabled : styles.textActive;
  const rootStyles = disabled ? styles.rootContainerDisabled : styles.rootContainerActive;

  return (
    <TouchableOpacity style={[styles.rootContainer, rootStyles]} onPress={onPress} disabled={disabled}>
      <Icon size={formatSize(24)} name={iconName} fill={fillColor} style={{ ...styles.icon, ...iconStyles }} />
      <Text style={[styles.text, textStyles]}>{text}</Text>
    </TouchableOpacity>
  );
};
