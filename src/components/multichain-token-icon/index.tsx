import React, { FC } from 'react';
import { View } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { TokenIcon, TokenIconProps } from 'src/components/token-icon/token-icon';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { useMultichainTokenIconStyles } from './styles';

interface MultichainProps {
  showNetworkBadge?: boolean;
}

export type MultichainTokenIconProps = TokenIconProps & MultichainProps;

export const MultichainTokenIcon: FC<MultichainTokenIconProps> = props => {
  const styles = useMultichainTokenIconStyles();
  const { showNetworkBadge, ...tokenIconProps } = props;
  const networkIconName =
    props.chainKind === TempleChainKind.Tezos
      ? CryptoLogoNameEnum.Tezos
      : props.chainKind === TempleChainKind.EVM
      ? CryptoLogoNameEnum.Etherlink
      : undefined;
  const icon = <TokenIcon {...tokenIconProps} />;

  if (!showNetworkBadge || !networkIconName) {
    return icon;
  }

  return (
    <View style={styles.container}>
      {icon}
      <View style={styles.networkBadge}>
        <NetworkIcon name={networkIconName} variant="tokenBadge" />
      </View>
    </View>
  );
};
