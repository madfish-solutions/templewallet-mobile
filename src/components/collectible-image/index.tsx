import React, { ComponentType, memo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { WebView } from 'react-native-webview';

import { useTezosCollectibleImagesStack } from 'src/hooks/use-images-stack';
import { AssetMediaURIs } from 'src/utils/assets/types';
import { isImgUriDataUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';

import { ActivityIndicator } from '../activity-indicator';
import { BlurredImageBackground } from '../blurred-image-frame';
import { BrokenImage } from '../broken-image';
import { CollectibleImageRenderer } from '../collectible-image-renderer';
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

    const { src, isStackFailed, isLoading, onSuccess, onFail } = useTezosCollectibleImagesStack(
      slug,
      artifactUri,
      displayUri,
      thumbnailUri,
      isFullView
    );
    const srcDataUri = src && isImgUriDataUri(src) ? src : undefined;
    const base64DataUri = artifactUri && isSvgDataUriInBase64Encoding(artifactUri) ? artifactUri : undefined;
    const isDataUri = srcDataUri != null || base64DataUri != null;
    const isMediaLoading = !isDataUri && isLoading;
    const dataUriForeground = srcDataUri ? (
      <DataUriImage
        dataUri={srcDataUri}
        animated={isFullView}
        width={size}
        height={size}
        style={styles.containedImage}
        onLoad={onSuccess}
        onError={onFail}
      />
    ) : base64DataUri ? (
      <Base64SvgImage
        dataUri={base64DataUri}
        size={size}
        isLoading={isLoading}
        isFullView={isFullView}
        onLoad={onSuccess}
        onError={onFail}
      />
    ) : undefined;

    return (
      <CollectibleImageRenderer
        sourceUri={src ?? artifactUri}
        size={size}
        isFailed={isStackFailed && artifactUri == null}
        fallback={
          Fallback ? (
            <Fallback isFullView={isFullView} />
          ) : (
            <BrokenImage isBigIcon={isFullView} style={styles.brokenImage} />
          )
        }
        dataUriForeground={dataUriForeground}
        forceFrame={isBlurred}
        frameStyle={styles.container}
        background={
          isDataUri ? null : isFullView ? (
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
        isForegroundHidden={isBlurred}
        overlay={
          isBlurred && !isMediaLoading ? (
            <ImageBlurOverlay size={size} isBigIcon={isFullView} onPress={onReveal} />
          ) : null
        }
        isLoading={isMediaLoading}
        isFullView={isFullView}
        onLoad={onSuccess}
        onError={onFail}
      />
    );
  }
);

interface Base64SvgImageProps {
  dataUri: string;
  size: number;
  isLoading: boolean;
  isFullView: boolean;
  onLoad: EmptyFn;
  onError: EmptyFn;
}

const Base64SvgImage = memo<Base64SvgImageProps>(({ dataUri, size, isLoading, isFullView, onLoad, onError }) => {
  const styles = useCollectibleImageStyles();
  const base64Data = dataUri.replace(/^data:image\/svg\+xml;base64,/, '');
  const svgXml = Buffer.from(base64Data, 'base64').toString('utf8');

  if (svgXml.includes('<foreignObject')) {
    const html = `
    <html>
      <body style="margin:0;padding:0;background:transparent;">
        <img src="data:image/svg+xml;base64,${base64Data}" style="width:100%;height:100%;" />
      </body>
    </html>
  `;

    return (
      <View style={{ width: size, height: size }}>
        <WebView
          source={{ html }}
          style={{ width: size, height: size }}
          onError={onError}
          onLoad={onLoad}
          scrollEnabled={false}
          pointerEvents="none"
        />
        {isLoading ? <ActivityIndicator size={isFullView ? 'large' : 'small'} /> : null}
      </View>
    );
  }

  return (
    <View style={{ width: size, height: size }}>
      <SvgXml xml={svgXml} width={size} height={size} style={styles.containedImage} onError={onError} onLoad={onLoad} />
    </View>
  );
});

interface CollectiblePreviewBackgroundProps extends AssetMediaURIs {
  slug: string;
}

const CollectiblePreviewBackground = memo<CollectiblePreviewBackgroundProps>(
  ({ slug, artifactUri, displayUri, thumbnailUri }) => {
    const { src, onFail } = useTezosCollectibleImagesStack(slug, artifactUri, displayUri, thumbnailUri, false);

    return <BlurredImageBackground uri={src} onError={onFail} />;
  }
);
