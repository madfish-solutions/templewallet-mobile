import FastImage from '@d11/react-native-fast-image';
import React, { ComponentType, memo } from 'react';

import { useCollectibleImagesStack } from 'src/hooks/use-images-stack';
import { AssetMediaURIs } from 'src/utils/assets/types';
import { isImgUriDataUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';

import { ActivityIndicator } from '../activity-indicator';
import { BlurredImageBackground, BlurredImageFrame } from '../blurred-image-frame';
import { BrokenImage } from '../broken-image';
import { DataUriImage } from '../data-uri-image';
import { ImageBlurOverlay } from '../image-blur-overlay';

import { useCollectibleImageStyles } from './styles';

interface Props extends AssetMediaURIs {
  slug: string;
  size: number;
  isFullView?: boolean;
  isBlurred?: boolean;
  onReveal?: EmptyFn;
  Fallback?: ComponentType<{ isFullView?: boolean }>;
}

export const CollectibleImage = memo<Props>(
  ({
    slug,
    artifactUri,
    displayUri,
    thumbnailUri,
    size,
    isFullView = false,
    isBlurred = false,
    onReveal,
    Fallback
  }) => {
    const styles = useCollectibleImageStyles();

    const { src, isStackFailed, isLoading, onSuccess, onFail } = useCollectibleImagesStack(
      slug,
      artifactUri,
      displayUri,
      thumbnailUri,
      isFullView
    );
    if (isStackFailed && artifactUri == null) {
      return Fallback ? (
        <Fallback isFullView={isFullView} />
      ) : (
        <BrokenImage isBigIcon={isFullView} style={styles.brokenImage} />
      );
    }

    const srcDataUri = src && (isImgUriDataUri(src) || isSvgDataUriInBase64Encoding(src)) ? src : undefined;
    const dataUri = srcDataUri ?? (artifactUri && isSvgDataUriInBase64Encoding(artifactUri) ? artifactUri : undefined);
    const foreground = dataUri ? (
      <DataUriImage
        dataUri={dataUri}
        animated={isFullView && isImgUriDataUri(dataUri)}
        width={size}
        height={size}
        onLoad={onSuccess}
        onError={onFail}
      />
    ) : (
      <FastImage
        style={styles.image}
        source={{ uri: src ?? artifactUri }}
        resizeMode="contain"
        onError={onFail}
        onLoad={onSuccess}
      />
    );

    return (
      <BlurredImageFrame
        size={size}
        style={styles.container}
        background={
          isFullView ? (
            <CollectiblePreviewBackground
              slug={slug}
              artifactUri={artifactUri}
              displayUri={displayUri}
              thumbnailUri={thumbnailUri}
            />
          ) : (
            <BlurredImageBackground uri={src} />
          )
        }
        foreground={foreground}
        isForegroundHidden={isBlurred}
        overlay={
          <>
            {isBlurred && !isLoading ? (
              <ImageBlurOverlay size={size} isBigIcon={isFullView} onPress={onReveal} />
            ) : null}
            {isLoading ? <ActivityIndicator size={isFullView ? 'large' : 'small'} /> : null}
          </>
        }
      />
    );
  }
);

interface CollectiblePreviewBackgroundProps extends AssetMediaURIs {
  slug: string;
}

const CollectiblePreviewBackground = memo<CollectiblePreviewBackgroundProps>(
  ({ slug, artifactUri, displayUri, thumbnailUri }) => {
    const { src, onFail } = useCollectibleImagesStack(slug, artifactUri, displayUri, thumbnailUri, false);

    return <BlurredImageBackground uri={src} onError={onFail} />;
  }
);
