import React, { FC } from 'react';
import { View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { formatSize } from 'src/styles/format-size';

import { useNetworkLogoStyles } from './styles';

interface Props {
  name: CryptoLogoNameEnum;
  variant?: NetworkIconVariant;
}

export type NetworkIconVariant = 'compact' | 'compactTransparent' | 'tokenBadge' | 'badge' | 'large';

export const NetworkIcon: FC<Props> = ({ name, variant = 'compact' }) => {
  const styles = useNetworkLogoStyles();

  return (
    <View style={[styles.common, styles[variant]]}>
      <CryptoLogo
        name={name}
        size={variant === 'large' ? formatSize(28) : variant === 'badge' ? formatSize(20) : formatSize(12)}
      />
    </View>
  );
};
