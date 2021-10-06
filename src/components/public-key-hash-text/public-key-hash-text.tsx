import React, { FC } from 'react';
import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native';

import { MarginProps } from '../../interfaces/margin.props';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { getTruncatedProps } from '../../utils/style.util';
import { usePublicKeyHashTextStyles } from './public-key-hash-text.styles';

interface Props extends MarginProps {
  publicKeyHash: string;
}

export const PublicKeyHashText: FC<Props> = ({ publicKeyHash, marginTop, marginRight, marginBottom, marginLeft }) => {
  const styles = usePublicKeyHashTextStyles();

  const handlePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    copyStringToClipboard(publicKeyHash);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { marginTop, marginRight, marginBottom, marginLeft }]}
      onPress={handlePress}
    >
      <Text {...getTruncatedProps(styles.publicKeyHashText, 'middle')} style={styles.publicKeyHashText}>
        {publicKeyHash}
      </Text>
    </TouchableOpacity>
  );
};
