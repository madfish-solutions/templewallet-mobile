import React, { FC } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
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
      Component={SafeTouchableOpacity}
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
