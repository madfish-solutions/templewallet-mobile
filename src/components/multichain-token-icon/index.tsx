import React, { FC } from 'react';
import { View } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { EvmTokenIcon } from 'src/components/token-icon/evm-token-icon';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { formatSize } from 'src/styles/format-size';

import { useMultichainTokenIconStyles } from './styles';

interface CommonProps {
  showNetworkBadge?: boolean;
  size?: number;
}

interface TezosTokenIconProps extends CommonProps {
  chainKind: TempleChainKind.Tezos;
  iconName?: CryptoLogoNameEnum;
  thumbnailUri?: string;
}

interface EvmTokenIconProps extends CommonProps {
  address: string;
  chainId: number;
  chainKind: TempleChainKind.EVM;
  iconName?: CryptoLogoNameEnum;
  iconURL?: string;
}

interface UnspecifiedTokenIconProps extends CommonProps {
  chainKind?: undefined;
  iconName?: CryptoLogoNameEnum;
  thumbnailUri?: string;
}

export type MultichainTokenIconProps = TezosTokenIconProps | EvmTokenIconProps | UnspecifiedTokenIconProps;

export const MultichainTokenIcon: FC<MultichainTokenIconProps> = props => {
  const styles = useMultichainTokenIconStyles();
  const size = props.size ?? formatSize(32);
  const networkIconName =
    props.chainKind === TempleChainKind.Tezos
      ? CryptoLogoNameEnum.Tezos
      : props.chainKind === TempleChainKind.EVM
      ? CryptoLogoNameEnum.Etherlink
      : undefined;
  const icon =
    props.chainKind === TempleChainKind.EVM && !props.iconName ? (
      <EvmTokenIcon size={size} chainId={props.chainId} address={props.address} iconURL={props.iconURL} />
    ) : (
      <TokenIcon
        size={size}
        iconName={props.iconName}
        thumbnailUri={'thumbnailUri' in props ? props.thumbnailUri : undefined}
      />
    );

  if (!props.showNetworkBadge || !networkIconName) {
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
