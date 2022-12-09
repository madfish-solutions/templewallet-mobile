import React, { FC } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { formatSize } from '../../../styles/format-size';
import { useHiddenButtonStyles } from './hidden-button.styles';

interface Props {
  text: string;
  iconName: IconNameEnum;
  onPress: () => void;
}

export const HiddenButton: FC<Props> = ({ text, iconName, onPress }) => {
  const styles = useHiddenButtonStyles();

  return (
    <TouchableOpacity style={styles.rootContainer} onPress={onPress}>
      <Icon size={formatSize(24)} name={iconName} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
