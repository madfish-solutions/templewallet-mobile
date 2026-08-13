import FastImage from '@d11/react-native-fast-image';
import React, { ComponentType, memo } from 'react';
import { Platform, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { WebView } from 'react-native-webview';

import { useCollectibleImagesStack } from 'src/hooks/use-images-stack';
import { AssetMediaURIs } from 'src/utils/assets/types';
import { isImgUriDataUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';

import { ActivityIndicator } from '../activity-indicator';
import { BrokenImage } from '../broken-image';
import { DataUriImage } from '../data-uri-image';
import { ImageBlurOverlay } from '../image-blur-overlay';

import { useCollectibleImageStyles } from './styles';

const BLUR_RADIUS = Platform.select({ android: 42, default: 16 });

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
    const { src: blurSrc, onFail: onBlurFail } = useCollectibleImagesStack(
      slug,
      artifactUri,
      displayUri,
      thumbnailUri,
      false
    );

    if (isStackFailed && artifactUri == null) {
      return Fallback ? (
        <Fallback isFullView={isFullView} />
      ) : (
        <BrokenImage isBigIcon={isFullView} style={styles.brokenImage} />
      );
    }

    if (src && isImgUriDataUri(src)) {
      return (
        <DataUriImage
          dataUri={src}
          animated={isFullView} // Performance issues in NFTs grid on iOS
          width={size}
          height={size}
          style={styles.containedImage}
          onLoad={onSuccess}
          onError={onFail}
        />
      );
    }

    if (artifactUri && isSvgDataUriInBase64Encoding(artifactUri)) {
      const base64Data = artifactUri.replace(/^data:image\/svg\+xml;base64,/, '');
      const svgXml = Buffer.from(base64Data, 'base64').toString('utf8');

      const containsForeignObject = svgXml.includes('<foreignObject');

      if (containsForeignObject) {
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
              onError={onFail}
              onLoad={onSuccess}
              scrollEnabled={false}
              pointerEvents="none"
            />
            {isLoading && <ActivityIndicator size={isFullView ? 'large' : 'small'} style={{ position: 'absolute' }} />}
          </View>
        );
      } else {
        return (
          <View style={{ width: size, height: size }}>
            <SvgXml
              xml={svgXml}
              width={size}
              height={size}
              style={styles.containedImage}
              onError={onFail}
              onLoad={onSuccess}
            />
          </View>
        );
      }
    }

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <FastImage
          style={styles.image}
          source={blurSrc ? { uri: blurSrc } : undefined}
          resizeMode="cover"
          blurRadius={BLUR_RADIUS}
          onError={onBlurFail}
        />
        <FastImage
          style={[styles.image, isBlurred && styles.zeroOpacity]}
          source={{ uri: src ?? artifactUri }}
          resizeMode="contain"
          onError={onFail}
          onLoad={onSuccess}
        />

        {isBlurred && !isLoading ? <ImageBlurOverlay size={size} isBigIcon={isFullView} onPress={onReveal} /> : null}

        {isLoading ? <ActivityIndicator size={isFullView ? 'large' : 'small'} /> : null}
      </View>
    );
  }
);
