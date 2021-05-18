import React, { FC } from 'react';
import { Text } from 'react-native';

import { MarginProps } from '../../interfaces/margin.props';
import { usePublicKeyHashTextStyles } from './public-key-hash-text.styles';

interface Props extends MarginProps {
  publicKeyHash: string;
}

export const PublicKeyHashText: FC<Props> = ({ publicKeyHash, marginTop, marginRight, marginBottom, marginLeft }) => {
  const styles = usePublicKeyHashTextStyles();

  return (
    <Text
      style={[styles.publicKeyHashText, { marginTop, marginRight, marginBottom, marginLeft }]}
      numberOfLines={1}
      ellipsizeMode="middle">
      {publicKeyHash}
    </Text>
  );
};
