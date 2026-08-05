import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import NftPlaceholderLogo from '../crypto-logo/assets/nft-placeholder.svg';

interface Props {
  borderRadius: number;
  size: number;
}

export const NftFallbackIcon: FC<Props> = ({ borderRadius, size }) => {
  const containerStyle = useMemo(
    () => ({
      alignItems: 'center' as const,
      borderRadius,
      height: size,
      justifyContent: 'center' as const,
      overflow: 'hidden' as const,
      width: size
    }),
    [borderRadius, size]
  );

  return (
    <View style={containerStyle}>
      <NftPlaceholderLogo width={size} height={size} />
    </View>
  );
};
