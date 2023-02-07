import React, { FC, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgXml } from 'react-native-svg';

import { formatSize } from 'src/styles/format-size';
import {
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktMediumUri,
  formatImgUri
} from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { CollectibleIconProps, CollectibleIconSize } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

interface LoadStrategy {
  type: string;
  uri: (value: string) => string;
  field: 'thumbnailUri' | 'artifactUri' | 'displayUri' | 'assetSlug';
}

const collectibleBigLoadStrategy: Array<LoadStrategy> = [
  { type: 'objktArtifact', uri: formatCollectibleObjktArtifactUri, field: 'artifactUri' },
  { type: 'objktMed', uri: formatCollectibleObjktMediumUri, field: 'assetSlug' }, // gif
  { type: 'displayUri', uri: formatImgUri, field: 'displayUri' },
  { type: 'artifactUri', uri: formatImgUri, field: 'artifactUri' },
  { type: 'thumbnailUri', uri: formatImgUri, field: 'thumbnailUri' }
];

const collectibleThumbnailLoadStrategy: Array<LoadStrategy> = [
  { type: 'objktMed', uri: formatCollectibleObjktMediumUri, field: 'assetSlug' }, // gif
  { type: 'objktArtifact', uri: formatCollectibleObjktArtifactUri, field: 'artifactUri' },
  { type: 'displayUri', uri: formatImgUri, field: 'displayUri' },
  { type: 'artifactUri', uri: formatImgUri, field: 'artifactUri' },
  { type: 'thumbnailUri', uri: formatImgUri, field: 'thumbnailUri' }
];

interface MetadataFormats {
  dimensions: {
    unit: string;
    value: string;
  };
  fileName: string;
  fileSize: number;
  mimeType: string;
  uri: string;
}

type ImageRequestObject = {
  assetSlug: string;
  displayUri?: string;
  artifactUri?: string;
  thumbnailUri?: string;
  formats?: Array<MetadataFormats>;
};

const getFirstFallback = (
  strategy: Array<LoadStrategy>,
  currentState: Record<string, boolean>,
  metadata: ImageRequestObject
): LoadStrategy => {
  for (const strategyItem of strategy) {
    const isArtifactUri = isDefined(metadata.artifactUri) && strategyItem.field === 'artifactUri';
    const isDisplayUri = isDefined(metadata.displayUri) && strategyItem.field === 'displayUri';
    const isThumbnailUri = isDefined(metadata.thumbnailUri) && strategyItem.field === 'thumbnailUri';
    const isObjktMed =
      ((isDefined(metadata.formats) && metadata.formats.some(x => x.mimeType === 'image/gif')) ||
        !isDefined(metadata.formats)) &&
      strategyItem.type === 'objktMed';
    if ((isArtifactUri || isDisplayUri || isThumbnailUri || isObjktMed) && !currentState[strategyItem.type]) {
      return strategyItem;
    }
  }

  return strategy[0];
};

export const CollectibleIcon: FC<CollectibleIconProps> = ({
  collectible,
  size,
  iconSize = CollectibleIconSize.SMALL
}) => {
  const styles = useCollectibleIconStyles();
  const actualLoadingStrategy =
    iconSize === CollectibleIconSize.SMALL ? collectibleThumbnailLoadStrategy : collectibleBigLoadStrategy;
  const [isLoadingFailed, setIsLoadingFailed] = useState(
    actualLoadingStrategy.reduce<Record<string, boolean>>((acc, cur) => ({ ...acc, [cur.type]: false }), {})
  );
  const assetSlug = `${collectible?.address}_${collectible?.id}`;

  const imageRequestObject = { ...collectible, assetSlug };
  const currentFallback = getFirstFallback(actualLoadingStrategy, isLoadingFailed, imageRequestObject);
  const imageSrc = currentFallback.uri(imageRequestObject[currentFallback.field] ?? assetSlug);

  const handleLoadingFailed = () => {
    setIsLoadingFailed(prevState => ({ ...prevState, [currentFallback.type]: true }));
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        padding: formatSize(4)
      }}
    >
      {isDefined(collectible.thumbnailUri) &&
        isDefined(collectible.artifactUri) &&
        (isSvgDataUriInUtf8Encoding(imageSrc) ? (
          <SvgXml style={styles.image} xml={getXmlFromSvgDataUriInUtf8Encoding(imageSrc)} />
        ) : (
          <FastImage style={styles.image} source={{ uri: imageSrc }} onError={handleLoadingFailed} />
        ))}
    </View>
  );
};

const SVG_DATA_URI_UTF8_PREFIX = 'data:image/svg+xml;charset=utf-8,';

const isSvgDataUriInUtf8Encoding = (uri: string) =>
  uri.slice(0, SVG_DATA_URI_UTF8_PREFIX.length).toLowerCase() === SVG_DATA_URI_UTF8_PREFIX;

const getXmlFromSvgDataUriInUtf8Encoding = (uri: string) =>
  decodeURIComponent(uri).slice(SVG_DATA_URI_UTF8_PREFIX.length);
