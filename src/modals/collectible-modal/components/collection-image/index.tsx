import FastImage from '@d11/react-native-fast-image';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SvgUri, SvgXml } from 'react-native-svg';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum.ts';
import { useCollectionLogoImagesStack } from 'src/hooks/use-images-stack';
import { formatSize } from 'src/styles/format-size.ts';
import { isImgUriSvg, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils.ts';

import { COLLECTION_ICON_SIZE } from '../../constants.ts';

const size = formatSize(COLLECTION_ICON_SIZE);

interface Props {
  uri?: string | null;
}

export const CollectionImage: FC<Props> = ({ uri }) => {
  const base64SvgUri = uri && isSvgDataUriInBase64Encoding(uri) ? uri : undefined;
  const { src, isLoading, isStackFailed, onSuccess, onFail } = useCollectionLogoImagesStack(
    base64SvgUri ? undefined : uri
  );
  const fallback = (
    <CryptoLogo
      name={CryptoLogoNameEnum.CollectiblePlaceholder}
      size={size}
      internalSize={size}
      style={styles.fallback}
    />
  );

  if (base64SvgUri) {
    const svgXml = Buffer.from(base64SvgUri.replace(/^data:image\/svg\+xml;base64,/, ''), 'base64').toString('utf8');

    return (
      <View style={styles.container}>
        <SvgXml xml={svgXml} width={size} height={size} style={styles.logo} fallback={fallback} />
      </View>
    );
  }

  if (isStackFailed || src == null) {
    return fallback;
  }

  const imageStyle = [styles.logo, isLoading && styles.hidden];

  if (isImgUriSvg(src)) {
    return (
      <View style={styles.container}>
        {isLoading && fallback}
        <SvgUri uri={src} height={size} width={size} style={imageStyle} onLoad={onSuccess} onError={onFail} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && fallback}
      {src.startsWith('data:') ? (
        <Image key={src} source={{ uri: src }} style={imageStyle} onLoad={onSuccess} onError={onFail} />
      ) : (
        <FastImage key={src} source={{ uri: src }} style={imageStyle} onLoad={onSuccess} onError={onFail} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: size,
    width: size,
    marginRight: formatSize(8)
  },
  logo: {
    height: size,
    width: size,
    borderRadius: formatSize(8),
    position: 'absolute'
  },
  hidden: {
    opacity: 0
  },
  fallback: {
    marginRight: formatSize(8)
  }
});
