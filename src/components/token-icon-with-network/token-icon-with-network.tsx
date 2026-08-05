import React, { FC, ReactNode } from 'react';
import { View } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { useTokenIconWithNetworkStyles } from './token-icon-with-network.styles';

interface Props {
  chainKind?: TempleChainKind;
  children: ReactNode;
}

export const TokenIconWithNetwork: FC<Props> = ({ chainKind, children }) => {
  const styles = useTokenIconWithNetworkStyles();
  const networkLogoName =
    chainKind === TempleChainKind.Tezos
      ? CryptoLogoNameEnum.Tezos
      : chainKind === TempleChainKind.EVM
      ? CryptoLogoNameEnum.Etherlink
      : undefined;

  return (
    <View style={styles.container}>
      {children}
      {networkLogoName && (
        <View style={styles.networkBadge}>
          <NetworkIcon name={networkLogoName} variant="tokenBadge" />
        </View>
      )}
    </View>
  );
};
