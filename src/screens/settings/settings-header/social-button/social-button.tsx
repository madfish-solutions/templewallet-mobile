import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { GestureResponderEvent, ViewStyle } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking';

import { useSocialButtonStyles } from './social-button.styles';

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  url: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  color?: string;
  size?: number;
}

export const SocialButton: FC<Props> = ({ iconName, url, style, color, size = formatSize(24), testID, onPress }) => {
  const styles = useSocialButtonStyles();

  const handleOnPress = (e: GestureResponderEvent) => {
    if (isDefined(onPress)) {
      return onPress(e);
    } else {
      return url ? openUrl(url) : undefined;
    }
  };

  return (
    <TouchableWithAnalytics
      Component={TouchableOpacity}
      style={[styles.container, style]}
      onPress={handleOnPress}
      testID={testID}
    >
      <Icon name={iconName} size={size} color={color} />
    </TouchableWithAnalytics>
  );
};
