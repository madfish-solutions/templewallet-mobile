import React, { FC } from 'react';
import { Text, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { MarginProps } from 'src/interfaces/margin.props';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { truncateLongAddress } from 'src/utils/exolix.util';
import { getTruncatedProps } from 'src/utils/style.util';

import { OriginalTouchableOpacityComponentType, TouchableWithAnalytics } from '../touchable-with-analytics';
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
      Component={TouchableOpacity as OriginalTouchableOpacityComponentType}
      style={[styles.container, style, { marginTop, marginRight, marginBottom, marginLeft }]}
      disabled={disabled}
      shouldTrackLongPress={longPress}
      shouldTrackShortPress={!longPress}
      onPress={handlePress}
      onLongPress={handleLongPress}
      testID={testID}
      testIDProperties={testIDProperties}
    >
      <Text {...getTruncatedProps(styles.publicKeyHashText, 'middle')} style={styles.publicKeyHashText}>
        {truncateLongAddress(publicKeyHash)}
      </Text>
    </TouchableWithAnalytics>
  );
};
