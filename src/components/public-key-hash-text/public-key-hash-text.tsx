import React, { FC } from 'react';
import { ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { MarginProps } from 'src/interfaces/margin.props';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';

import { TouchableWithAnalytics } from '../touchable-with-analytics';
import { TruncatedText } from '../truncated-text';

import { usePublicKeyHashTextStyles } from './public-key-hash-text.styles';

interface Props extends MarginProps, TestIdProps {
  publicKeyHash: string;
  disabled?: boolean;
  longPress?: boolean;
  style?: ViewStyle;
}

export const PublicKeyHashText: FC<Props> = ({
  publicKeyHash,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  style,
  disabled = false,
  longPress = false,
  testID,
  testIDProperties
}) => {
  const styles = usePublicKeyHashTextStyles();

  const handlePress = () => !longPress && copyStringToClipboard(publicKeyHash);
  const handleLongPress = () => longPress && copyStringToClipboard(publicKeyHash);

  return (
    <TouchableWithAnalytics
      Component={TouchableOpacity}
      style={[styles.container, style, { marginTop, marginRight, marginBottom, marginLeft }]}
      disabled={disabled}
      shouldTrackLongPress={longPress}
      shouldTrackShortPress={!longPress}
      onPress={handlePress}
      onLongPress={handleLongPress}
      testID={testID}
      testIDProperties={testIDProperties}
    >
      <TruncatedText ellipsizeMode="middle" style={styles.publicKeyHashText}>
        {publicKeyHash}
      </TruncatedText>
    </TouchableWithAnalytics>
  );
};
