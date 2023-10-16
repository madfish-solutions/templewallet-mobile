import React, { FC } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { OriginalTouchableOpacityComponentType, TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import type { EmptyFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useColors } from 'src/styles/use-colors';
import { openUrl } from 'src/utils/linking';

import { Icon } from '../icon';
import { IconNameEnum } from '../icon-name.enum';
import { useExternalLinkButtonStyles } from './external-link-button.styles';

interface Props extends TestIdProps {
  url: string;
  style?: StyleProp<ViewStyle>;
  onPress?: EmptyFn;
}

export const ExternalLinkButton: FC<Props> = ({ url, testID, style, onPress }) => {
  const colors = useColors();
  const styles = useExternalLinkButtonStyles();

  return (
    <TouchableWithAnalytics
      Component={TouchableOpacity as OriginalTouchableOpacityComponentType}
      style={[styles.container, style]}
      testID={testID}
      onPress={() => {
        openUrl(url);
        onPress?.();
      }}
    >
      <Icon name={IconNameEnum.ExternalLink} color={colors.blue} />
    </TouchableWithAnalytics>
  );
};
