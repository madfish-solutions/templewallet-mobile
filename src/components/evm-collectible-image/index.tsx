import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useImagesStack } from 'src/hooks/use-images-stack';
import { formatSize } from 'src/styles/format-size';
import { buildEvmCollectibleImagesStack, isImgUriDataUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';

import { ActivityIndicator } from '../activity-indicator';
import { BlurredImageBackground, BlurredImageFrame } from '../blurred-image-frame';
import { BrokenImage } from '../broken-image';
import { DataUriImage } from '../data-uri-image';

interface Props {
  uri?: string;
  size: number;
  isFullView?: boolean;
}

export const EvmCollectibleImage = memo<Props>(({ uri, size, isFullView = false }) => {
  const sources = useMemo(() => buildEvmCollectibleImagesStack(uri), [uri]);
  const { src, isLoading, isStackFailed, onSuccess, onFail } = useImagesStack(sources);

  if (isStackFailed) {
    return <BrokenImage isBigIcon={isFullView} style={{ width: size, height: size }} />;
  }

  const isDataUri = src != null && (isImgUriDataUri(src) || isSvgDataUriInBase64Encoding(src));
  const foreground = isDataUri ? (
    <DataUriImage dataUri={src} width={size} height={size} onLoad={onSuccess} onError={onFail} />
  ) : (
    <FastImage style={styles.image} source={{ uri: src }} resizeMode="contain" onLoad={onSuccess} onError={onFail} />
  );

  return (
    <BlurredImageFrame
      size={size}
      style={!isFullView && styles.rounded}
      background={<BlurredImageBackground uri={src} />}
      foreground={foreground}
      overlay={isLoading ? <ActivityIndicator size={isFullView ? 'large' : 'small'} /> : null}
    />
  );
});

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%'
  },
  rounded: {
    borderRadius: formatSize(4)
  }
});
