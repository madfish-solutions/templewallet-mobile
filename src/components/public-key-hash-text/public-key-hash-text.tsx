import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text } from 'react-native';

import { MarginProps } from '../../interfaces/margin.props';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { usePublicKeyHashTextStyles } from './public-key-hash-text.styles';

interface Props extends MarginProps {
  publicKeyHash: string;
}

export const PublicKeyHashText: FC<Props> = ({ publicKeyHash, marginTop, marginRight, marginBottom, marginLeft }) => {
  const styles = usePublicKeyHashTextStyles();

  return (
    <TouchableOpacity
      onPress={() => copyStringToClipboard(publicKeyHash)}
      style={[styles.container, { marginTop, marginRight, marginBottom, marginLeft }]}>
      <Text style={styles.publicKeyHashText} numberOfLines={1} ellipsizeMode="middle">
        {publicKeyHash}
      </Text>
    </TouchableOpacity>
  );
};
