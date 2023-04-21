import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { ViewStyle } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { TestIdProps } from '../../../../interfaces/test-id.props';
import { formatSize } from '../../../../styles/format-size';
import { openUrl } from '../../../../utils/linking.util';
import { useSocialButtonStyles } from './social-button.styles';

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  url: string;
  style?: ViewStyle | ViewStyle[];
  color?: string;
  size?: number;
}

export const SocialButton: FC<Props> = ({ iconName, url, style, color, size = formatSize(24) }) => {
  const styles = useSocialButtonStyles();

  const handleOnPress = () => (url ? openUrl(url) : undefined);

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={handleOnPress}>
      <Icon name={iconName} size={size} color={color} />
    </TouchableOpacity>
  );
};
