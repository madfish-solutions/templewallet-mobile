import React, { FC } from 'react';
import { View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { formatSize } from 'src/styles/format-size';

import { useNetworkLogoStyles } from './network-logo.styles';

interface Props {
  name: CryptoLogoNameEnum;
}

export const NetworkLogo: FC<Props> = ({ name }) => {
  const styles = useNetworkLogoStyles();

  return (
    <View style={styles.root}>
      <CryptoLogo name={name} size={formatSize(12)} internalSize={formatSize(12)} />
    </View>
  );
};
