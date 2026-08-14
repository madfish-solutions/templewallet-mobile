import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import { useEvmCollectibleImagesStack } from 'src/hooks/use-images-stack';
import { formatSize } from 'src/styles/format-size';
import { isImgUriDataUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';

import { BlurredImageBackground } from '../blurred-image-frame';
import { BrokenImage } from '../broken-image';
import { CollectibleImageRenderer } from '../collectible-image-renderer';
import { DataUriImage } from '../data-uri-image';

interface Props {
  assetSlug: string;
  chainId: number;
  uri?: string;
  size: number;
  isFullView?: boolean;
}

export const EvmCollectibleImage = memo<Props>(({ assetSlug, chainId, uri, size, isFullView = false }) => {
  const { src, isLoading, isStackFailed, onSuccess, onFail } = useEvmCollectibleImagesStack(chainId, assetSlug, uri);

  const isDataUri = src != null && (isImgUriDataUri(src) || isSvgDataUriInBase64Encoding(src));
  const dataUriForeground = isDataUri ? (
    <DataUriImage
      dataUri={src}
      width={size}
      height={size}
      style={!isFullView ? styles.rounded : undefined}
      onLoad={onSuccess}
      onError={onFail}
    />
  ) : undefined;

  return (
    <CollectibleImageRenderer
      sourceUri={src}
      size={size}
      isFailed={isStackFailed}
      fallback={<BrokenImage isBigIcon={isFullView} style={{ width: size, height: size }} />}
      dataUriForeground={dataUriForeground}
      background={<BlurredImageBackground uri={src} />}
      frameStyle={!isFullView && styles.rounded}
      isLoading={!isDataUri && isLoading}
      isFullView={isFullView}
      onLoad={onSuccess}
      onError={onFail}
    />
  );
});

const styles = StyleSheet.create({
  rounded: {
    borderRadius: formatSize(4)
  }
});
