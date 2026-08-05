import FastImage from '@d11/react-native-fast-image';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TokenIconStyles } from 'src/components/token-icon/token-icon.styles';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useImagesStack } from 'src/hooks/use-images-stack';
import { formatSize } from 'src/styles/format-size';
import { buildEvmTokenIconSources } from 'src/utils/image.utils';

import { useMultichainTokenIconStyles } from './styles';

interface CommonProps {
  showNetworkBadge?: boolean;
  size?: number;
}

interface TezosIconProps extends CommonProps {
  chainKind: TempleChainKind.Tezos;
  iconName?: CryptoLogoNameEnum;
  thumbnailUri?: string;
}

interface EvmIconProps extends CommonProps {
  address: string;
  chainId: number;
  chainKind: TempleChainKind.EVM;
  iconName?: CryptoLogoNameEnum;
  iconURL?: string;
}

interface UnspecifiedIconProps extends CommonProps {
  chainKind?: undefined;
  iconName?: CryptoLogoNameEnum;
  thumbnailUri?: string;
}

export type MultichainTokenIconProps = TezosIconProps | EvmIconProps | UnspecifiedIconProps;

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

interface EvmTokenIconProps {
  address: string;
  chainId: number;
  iconURL?: string;
  size: number;
}

const EvmTokenIcon: FC<EvmTokenIconProps> = ({ address, chainId, iconURL, size }) => {
  const sourcesStack = useMemo(() => buildEvmTokenIconSources(chainId, address, iconURL), [chainId, address, iconURL]);
  const { src, isLoading, isStackFailed, onSuccess, onFail } = useImagesStack(sourcesStack);
  const isShowPlaceholder = isLoading || isStackFailed;
  const imageStyle = useMemo(
    () => [isShowPlaceholder && TokenIconStyles.hiddenImage, { width: (size * 5) / 6, height: (size * 5) / 6 }],
    [isShowPlaceholder, size]
  );

  return (
    <View style={[TokenIconStyles.container, { borderRadius: size / 2, height: size, width: size }]}>
      {isShowPlaceholder && <TokenIcon size={size} />}
      {src != null && <FastImage style={imageStyle} source={{ uri: src }} onLoad={onSuccess} onError={onFail} />}
    </View>
  );
};
