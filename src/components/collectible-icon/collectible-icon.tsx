import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { formatSize } from 'src/styles/format-size';
import {
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktMediumUri,
  formatImgUri,
  isImgUriDataUri
} from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { DataUriImage } from '../data-uri-image';
import { CollectibleIconProps, CollectibleIconSize } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

interface LoadStrategy {
  type: string;
  uri: (value: string) => string;
  field: 'thumbnailUri' | 'artifactUri' | 'displayUri' | 'assetSlug';
}

type InitialLoadingState = Record<string, boolean>;

const getInitialLoadingState = (strategy: Array<LoadStrategy>) =>
  strategy.reduce<InitialLoadingState>((acc, cur) => ({ ...acc, [cur.type]: false }), {});

const collectibleBigLoadStrategy: Array<LoadStrategy> = [
  { type: 'objktArtifact', uri: formatCollectibleObjktArtifactUri, field: 'artifactUri' },
  { type: 'objktMed', uri: formatCollectibleObjktMediumUri, field: 'assetSlug' }, // gif
  { type: 'displayUri', uri: formatImgUri, field: 'displayUri' },
  { type: 'artifactUri', uri: formatImgUri, field: 'artifactUri' },
  { type: 'thumbnailUri', uri: formatImgUri, field: 'thumbnailUri' }
];

const bigLoadStrategyInitialLoadingState = getInitialLoadingState(collectibleBigLoadStrategy);

const collectibleThumbnailLoadStrategy: Array<LoadStrategy> = [
  { type: 'objktMed', uri: formatCollectibleObjktMediumUri, field: 'assetSlug' }, // gif
  { type: 'objktArtifact', uri: formatCollectibleObjktArtifactUri, field: 'artifactUri' },
  { type: 'displayUri', uri: formatImgUri, field: 'displayUri' },
  { type: 'artifactUri', uri: formatImgUri, field: 'artifactUri' },
  { type: 'thumbnailUri', uri: formatImgUri, field: 'thumbnailUri' }
];

const thumbnailLoadStrategyInitialLoadingState = getInitialLoadingState(collectibleThumbnailLoadStrategy);

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

  const isSmallIcon = iconSize === CollectibleIconSize.SMALL;

  const actualLoadingStrategy = useMemo(
    () => (isSmallIcon ? collectibleThumbnailLoadStrategy : collectibleBigLoadStrategy),
    [isSmallIcon]
  );

  const actualInitialLoadingState = useMemo(
    () => (isSmallIcon ? thumbnailLoadStrategyInitialLoadingState : bigLoadStrategyInitialLoadingState),
    [isSmallIcon]
  );

  const lastItemId = useRef(collectible.name);

  const [isLoadingFailed, setIsLoadingFailed] = useState<InitialLoadingState>(actualInitialLoadingState);
  if (collectible.name !== lastItemId.current) {
    lastItemId.current = collectible.name;
    setIsLoadingFailed(actualInitialLoadingState);
  }

  const assetSlug = `${collectible?.address}_${collectible?.id}`;

  const imageRequestObject = { ...collectible, assetSlug };
  const currentFallback = getFirstFallback(actualLoadingStrategy, isLoadingFailed, imageRequestObject);
  const imageSrc = currentFallback.uri(imageRequestObject[currentFallback.field] ?? assetSlug);

  const handleLoadingFailed = useCallback(
    () => setIsLoadingFailed(prevState => ({ ...prevState, [currentFallback.type]: true })),
    [currentFallback.type]
  );

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
        (isImgUriDataUri(imageSrc) ? (
          <DataUriImage style={styles.image} dataUri={imageSrc} />
        ) : (
          <FastImage style={styles.image} source={{ uri: imageSrc }} onError={handleLoadingFailed} />
        ))}
    </View>
  );
};
