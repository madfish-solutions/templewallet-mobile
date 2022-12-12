import React, { FC } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { formatSize } from '../../../../styles/format-size';
import { useHiddenButtonStyles } from './hidden-button.styles';

interface Props {
  text: string;
  iconName: IconNameEnum;
  fill?: string;
  onPress: () => void;
}

export const HiddenButton: FC<Props> = ({ text, iconName, fill, onPress }) => {
  const styles = useHiddenButtonStyles();

  return (
    <TouchableOpacity style={styles.rootContainer} onPress={onPress}>
      <Icon size={formatSize(24)} name={iconName} fill={fill} style={styles.icon} />
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
