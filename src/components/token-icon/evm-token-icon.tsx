import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useImagesStack } from 'src/hooks/use-images-stack';
import { formatSize } from 'src/styles/format-size';
import { buildEvmTokenIconSources } from 'src/utils/image.utils';

import { CryptoLogo } from '../crypto-logo';
import { CryptoLogoNameEnum } from '../crypto-logo/logo-name.enum';

import { TokenIconStyles } from './token-icon.styles';

interface Props {
  chainId: number;
  address: string;
  iconURL?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const EvmTokenIcon = memo<Props>(({ chainId, address, iconURL, size = formatSize(32), style }) => {
  const sourcesStack = useMemo(() => buildEvmTokenIconSources(chainId, address, iconURL), [chainId, address, iconURL]);

  const { src, isLoading, isStackFailed, onSuccess, onFail } = useImagesStack(sourcesStack);

  const isShowPlaceholder = isLoading || isStackFailed;

  const containerStyle = useMemo(
    () => [TokenIconStyles.container, { borderRadius: size / 2, width: size, height: size }, style],
    [size, style]
  );
  const imageStyle = useMemo(
    () => [isShowPlaceholder && TokenIconStyles.hiddenImage, { width: size, height: size }],
    [isShowPlaceholder, size]
  );

  return (
    <View style={containerStyle}>
      {isShowPlaceholder && <CryptoLogo name={CryptoLogoNameEnum.Placeholder} size={size} internalSize={size} />}
      {src != null && <FastImage style={imageStyle} source={{ uri: src }} onLoad={onSuccess} onError={onFail} />}
    </View>
  );
});
