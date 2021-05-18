import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { MarginProps } from '../../interfaces/margin.props';
import { usePublicKeyHashTextStyles } from './public-key-hash-text.styles';

interface Props extends MarginProps {
  publicKeyHash: string;
}

export const PublicKeyHashText: FC<Props> = ({ publicKeyHash, marginTop, marginRight, marginBottom, marginLeft }) => {
  const styles = usePublicKeyHashTextStyles();

  return (
    <View style={[styles.container, { marginTop, marginRight, marginBottom, marginLeft }]}>
      <Text style={styles.publicKeyHashText} numberOfLines={1} ellipsizeMode="middle">
        {publicKeyHash}
      </Text>
    </View>
  );
};
