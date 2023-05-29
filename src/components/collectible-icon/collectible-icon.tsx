import React, { FC, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

import { AnimatedSvg } from 'src/components/animated-svg/animated-svg';
import { SimpleModelView } from 'src/components/simple-model-view/simple-model-view';
import { formatSize } from 'src/styles/format-size';
import {
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktMediumUri,
  formatImgUri,
  isImgUriDataUri
} from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { CollectibleIconProps, CollectibleIconSize } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

enum MimeType {
  VIDEO = 'video/mp4',
  AUDIO = 'audio/mpeg',
  MODEL = 'model/gltf-binary',
  GIF = 'image/gif'
}

interface LoadStrategy {
  type: string;
  uri: (value: string) => string;
  field: 'thumbnailUri' | 'artifactUri' | 'displayUri' | 'assetSlug';
}

const collectibleBigLoadStrategy: Array<LoadStrategy> = [
  { type: 'animated', uri: formatCollectibleObjktArtifactUri, field: 'artifactUri' },
  { type: 'objktArtifact', uri: formatCollectibleObjktArtifactUri, field: 'artifactUri' },
  { type: 'objktMed', uri: formatCollectibleObjktMediumUri, field: 'assetSlug' }, // gif static thumb
  { type: 'displayUri', uri: formatImgUri, field: 'displayUri' },
  { type: 'artifactUri', uri: formatImgUri, field: 'artifactUri' },
  { type: 'thumbnailUri', uri: formatImgUri, field: 'thumbnailUri' }
];

const collectibleThumbnailLoadStrategy: Array<LoadStrategy> = [
  { type: 'objktMed', uri: formatCollectibleObjktMediumUri, field: 'assetSlug' }, // gif static thumb
  { type: 'objktArtifact', uri: formatCollectibleObjktArtifactUri, field: 'artifactUri' },
  { type: 'displayUri', uri: formatImgUri, field: 'displayUri' },
  { type: 'artifactUri', uri: formatImgUri, field: 'artifactUri' },
  { type: 'thumbnailUri', uri: formatImgUri, field: 'thumbnailUri' }
];

interface shortCollectibleMetadata {
  assetSlug: string;
  displayUri?: string;
  artifactUri?: string;
  thumbnailUri?: string;
  mime?: string;
}

const getNewFallback = (
  loadStrategy: Array<LoadStrategy>,
  failedFallbacksRecord: Record<string, boolean>,
  metadata: shortCollectibleMetadata
): LoadStrategy => {
  for (const strategyItem of loadStrategy) {
    const isArtifactUri = isDefined(metadata.artifactUri) && strategyItem.field === 'artifactUri';
    const isDisplayUri = isDefined(metadata.displayUri) && strategyItem.type === 'displayUri';
    const isThumbnailUri = isDefined(metadata.thumbnailUri) && strategyItem.type === 'thumbnailUri';
    const isObjktMed = !isDefined(metadata.mime) && strategyItem.type === 'objktMed';
    const isAnimated =
      isDefined(metadata.artifactUri) &&
      strategyItem.type === 'animated' &&
      (metadata.mime === MimeType.VIDEO || metadata.mime === MimeType.AUDIO || metadata.mime === MimeType.MODEL);

    if (
      (isAnimated || isArtifactUri || isDisplayUri || isThumbnailUri || isObjktMed) &&
      !failedFallbacksRecord[strategyItem.type]
    ) {
      return strategyItem;
    }
  }

  return loadStrategy[0];
};

export const CollectibleIcon: FC<CollectibleIconProps> = ({
  collectible,
  size,
  iconSize = CollectibleIconSize.SMALL,
  mime,
  objktArtifact
}) => {
  console.log(mime, 'mime');

  const styles = useCollectibleIconStyles();
  const actualLoadingStrategy =
    iconSize === CollectibleIconSize.SMALL ? collectibleThumbnailLoadStrategy : collectibleBigLoadStrategy;

  const [failedFallbacksRecord, setFailedFallbacksRecord] = useState(
    actualLoadingStrategy.reduce<Record<string, boolean>>((acc, cur) => ({ ...acc, [cur.type]: false }), {})
  );

  const assetSlug = `${collectible?.address}_${collectible?.id}`;
  const { displayUri, artifactUri, thumbnailUri } = collectible;

  const metadata: shortCollectibleMetadata = { assetSlug, artifactUri, thumbnailUri, displayUri, mime };

  const currentFallback = getNewFallback(actualLoadingStrategy, failedFallbacksRecord, metadata);
  const uri = currentFallback.uri(metadata[currentFallback.field] ?? assetSlug);

  console.log(uri, 'uri');

  const handleLoadingFailed = () => {
    setFailedFallbacksRecord(prevState => ({ ...prevState, [currentFallback.type]: true }));
  };

  const Icon = () => {
    if (isDefined(objktArtifact) && currentFallback.type === 'animated' && iconSize === CollectibleIconSize.BIG) {
      if (isImgUriDataUri(objktArtifact)) {
        return <AnimatedSvg style={styles.image} dataUri={uri} onError={handleLoadingFailed} />;
      } else if (mime === MimeType.MODEL) {
        return <SimpleModelView style={styles.image} uri={uri} onError={handleLoadingFailed} />;
      } else if (mime === MimeType.VIDEO || mime === MimeType.AUDIO) {
        return (
          <Video
            repeat
            source={{ uri: objktArtifact }}
            // @ts-ignore
            style={[{ width: size, height: size }, styles.image]}
            onError={handleLoadingFailed}
          />
        );
      }
    }

    return <FastImage style={styles.image} source={{ uri }} onError={handleLoadingFailed} />;
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        padding: formatSize(2)
      }}
    >
      <Icon />
    </View>
  );
};
