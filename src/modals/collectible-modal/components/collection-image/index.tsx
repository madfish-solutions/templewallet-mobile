import FastImage from '@d11/react-native-fast-image';
import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { SvgUri, SvgXml } from 'react-native-svg';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum.ts';
import { formatSize } from 'src/styles/format-size.ts';
import { formatImgUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils.ts';

import { COLLECTION_ICON_SIZE } from '../../constants.ts';

const size = formatSize(COLLECTION_ICON_SIZE);

interface Props {
  uri?: string | null;
}

export const CollectionImage: FC<Props> = ({ uri }) => {
  const [isFailed, setIsFailed] = useState(!uri);
  const handleError = () => setIsFailed(true);
  const fallback = (
    <CryptoLogo
      name={CryptoLogoNameEnum.CollectiblePlaceholder}
      size={size}
      internalSize={size}
      style={styles.fallback}
    />
  );

  useEffect(() => setIsFailed(!uri), [uri]);

  if (!uri || isFailed) {
    return fallback;
  }

  if (uri.endsWith('.svg')) {
    return <SvgUri uri={uri} height={size} width={size} style={styles.logo} fallback={fallback} />;
  }

  if (isSvgDataUriInBase64Encoding(uri)) {
    const base64Data = uri.replace(/^data:image\/svg\+xml;base64,/, '');
    const svgXml = Buffer.from(base64Data, 'base64').toString('utf8');

    return <SvgXml xml={svgXml} width={size} height={size} style={styles.logo} fallback={fallback} />;
  }

  const formattedUri = formatImgUri(uri);

  return formattedUri == null ? (
    <Image source={{ uri }} style={styles.logo} onError={handleError} />
  ) : (
    <FastImage source={{ uri: formattedUri }} style={styles.logo} onError={handleError} />
  );
};

const styles = StyleSheet.create({
  logo: {
    height: size,
    width: size,
    marginRight: formatSize(8),
    borderRadius: formatSize(8)
  },
  fallback: {
    margin: 0,
    marginRight: formatSize(8)
  }
});
