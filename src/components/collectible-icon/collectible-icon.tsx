import React, { FC, useCallback, useMemo, useState } from 'react';
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
import { ImageBlurOverlay } from '../image-blur-overlay/image-blur-overlay';
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
  iconSize = CollectibleIconSize.SMALL,
  blurLayoutTheme,
  isLoading = false,
  isTouchableOverlay
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

  const handleLoadingFailed = useCallback(() => {
    setIsLoadingFailed(prevState => ({ ...prevState, [currentFallback.type]: true }));
  }, [currentFallback]);

  const fastImage = useMemo(() => {
    if (isLoading) {
      return <View style={styles.image} />;
    }

    if (isDefined(collectible.isAdultContent) && collectible.isAdultContent) {
      return (
        <ImageBlurOverlay theme={blurLayoutTheme} isTouchableOverlay={isTouchableOverlay}>
          <FastImage style={styles.image} source={{ uri: imageSrc }} onError={handleLoadingFailed} />
        </ImageBlurOverlay>
      );
    }

    return <FastImage style={styles.image} source={{ uri: imageSrc }} onError={handleLoadingFailed} />;
  }, [collectible.isAdultContent, blurLayoutTheme, imageSrc, handleLoadingFailed, isLoading]);

  return (
    <View
      style={{
        width: size,
        height: size,
        padding: formatSize(2)
      }}
    >
      {isDefined(collectible.thumbnailUri) &&
        isDefined(collectible.artifactUri) &&
        (isImgUriDataUri(imageSrc) ? <DataUriImage style={styles.image} dataUri={imageSrc} /> : fastImage)}
    </View>
  );
};
