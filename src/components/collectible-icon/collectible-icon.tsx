import React, { FC, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { formatSize } from '../../styles/format-size';
import {
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktBigUri,
  formatCollectibleObjktMediumUri,
  formatImgUri
} from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { CollectibleIconProps } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

interface LoadStrategy {
  type: string;
  uri: (value: string) => string;
  field: 'thumbnailUri' | 'artifactUri' | 'displayUri' | 'assetSlug';
}

const collectibleLoadStrategy: Array<LoadStrategy> = [
  { type: 'objktMed', uri: formatCollectibleObjktMediumUri, field: 'assetSlug' }, // gif
  { type: 'objktBig', uri: formatCollectibleObjktBigUri, field: 'assetSlug' }, // png/jpg
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

export const CollectibleIcon: FC<CollectibleIconProps> = ({ collectible, size }) => {
  const styles = useCollectibleIconStyles();
  const [isLoadingFailed, setIsLoadingFailed] = useState(
    collectibleLoadStrategy.reduce<Record<string, boolean>>((acc, cur) => ({ ...acc, [cur.type]: false }), {})
  );
  const assetSlug = `${collectible?.address}_${collectible?.id}`;

  const imageRequestObject = { ...collectible, assetSlug };
  const currentFallback = getFirstFallback(collectibleLoadStrategy, isLoadingFailed, imageRequestObject);
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
      {isDefined(collectible) && isDefined(collectible.thumbnailUri) && isDefined(collectible.artifactUri) && (
        <FastImage style={styles.image} source={{ uri: imageSrc }} onError={handleLoadingFailed} />
      )}
    </View>
  );
};
