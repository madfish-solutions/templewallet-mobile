import FastImage from '@d11/react-native-fast-image';
import React, { FC, useCallback, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SvgUri, SvgXml } from 'react-native-svg';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum.ts';
import { formatSize } from 'src/styles/format-size.ts';
import { formatImgUri, isImgUriSvg, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils.ts';

import { COLLECTION_ICON_SIZE } from '../../constants.ts';

const size = formatSize(COLLECTION_ICON_SIZE);

interface Props {
  uri?: string | null;
}

export const CollectionImage: FC<Props> = ({ uri }) => {
  const [loadedUri, setLoadedUri] = useState<string | null>(null);
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const handleLoad = useCallback(() => setLoadedUri(uri ?? null), [uri]);
  const handleError = useCallback(() => setFailedUri(uri ?? null), [uri]);
  const fallback = (
    <CryptoLogo
      name={CryptoLogoNameEnum.CollectiblePlaceholder}
      size={size}
      internalSize={size}
      style={styles.fallback}
    />
  );

  if (!uri || failedUri === uri) {
    return fallback;
  }

  if (isSvgDataUriInBase64Encoding(uri)) {
    const base64Data = uri.replace(/^data:image\/svg\+xml;base64,/, '');
    const svgXml = Buffer.from(base64Data, 'base64').toString('utf8');

    return (
      <View style={styles.container}>
        <SvgXml xml={svgXml} width={size} height={size} style={styles.logo} fallback={fallback} />
      </View>
    );
  }

  const imageStyle = [styles.logo, loadedUri !== uri && styles.hidden];

  if (isImgUriSvg(uri)) {
    return (
      <View style={styles.container}>
        {loadedUri !== uri && fallback}
        <SvgUri uri={uri} height={size} width={size} style={imageStyle} onLoad={handleLoad} onError={handleError} />
      </View>
    );
  }

  const formattedUri = formatImgUri(uri);

  return (
    <View style={styles.container}>
      {loadedUri !== uri && fallback}
      {formattedUri == null ? (
        <Image source={{ uri }} style={imageStyle} onLoad={handleLoad} onError={handleError} />
      ) : (
        <FastImage source={{ uri: formattedUri }} style={imageStyle} onLoad={handleLoad} onError={handleError} />
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
