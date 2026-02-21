import React, { FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { openUrl } from 'src/utils/linking';

import { useSocialButtonStyles } from './styles';

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  url?: string | nullish;
  copyOnPress?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

export const SocialButton: FC<Props> = ({ iconName, url, style, size = formatSize(24), copyOnPress, testID }) => {
  const styles = useSocialButtonStyles();
  const colors = useColors();

  const disabled = !url;

  const handleOnPress = () => {
    if (disabled) {
      return;
    }

    if (copyOnPress) {
      copyStringToClipboard(url);
    } else {
      openUrl(url);
    }
  };

  return (
    <TouchableWithAnalytics
      Component={SafeTouchableOpacity}
      style={[styles.container, style]}
      onPress={handleOnPress}
      testID={testID}
    >
      <Icon name={iconName} size={size} color={disabled ? colors.disabled : colors.orange} />
    </TouchableWithAnalytics>
  );
};
