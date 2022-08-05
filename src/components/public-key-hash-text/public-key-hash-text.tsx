import React, { FC } from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { MarginProps } from '../../interfaces/margin.props';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { getTruncatedProps } from '../../utils/style.util';
import { usePublicKeyHashTextStyles } from './public-key-hash-text.styles';

interface Props extends MarginProps {
  publicKeyHash: string;
  disabled?: boolean;
  longPress?: boolean;
}

export const PublicKeyHashText: FC<Props> = ({
  publicKeyHash,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  disabled = false,
  longPress = false
}) => {
  const styles = usePublicKeyHashTextStyles();

  const handlePress = () => copyStringToClipboard(publicKeyHash);

  return (
    <TouchableOpacity
      style={[styles.container, { marginTop, marginRight, marginBottom, marginLeft }]}
      disabled={disabled}
      {...(longPress ? { onLongPress: handlePress } : { onPress: handlePress })}
    >
      <Text {...getTruncatedProps(styles.publicKeyHashText, 'middle')} style={styles.publicKeyHashText}>
        {publicKeyHash}
      </Text>
    </TouchableOpacity>
  );
};
