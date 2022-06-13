import React, { FC, useState } from 'react';
import { Image, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { formatCollectibleObjktBigUri, formatCollectibleObjktMediumUri, formatImgUri } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { CollectibleIconProps } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

interface LoadStrategy {
  type: string;
  uri: (value: string) => string;
  field: 'thumbnailUri' | 'artifactUri' | 'displayUri' | 'assetSlug';
}

const collectibleLoadStrategy: Array<LoadStrategy> = [
  { type: 'objktBig', uri: formatCollectibleObjktBigUri, field: 'assetSlug' },
  { type: 'objktMed', uri: formatCollectibleObjktMediumUri, field: 'assetSlug' },
  { type: 'displayUri', uri: formatImgUri, field: 'displayUri' },
  { type: 'artifactUri', uri: formatImgUri, field: 'artifactUri' },
  { type: 'thumbnailUri', uri: formatImgUri, field: 'thumbnailUri' }
];

type ImageRequestObject = { assetSlug: string; displayUri?: string; artifactUri?: string; thumbnailUri?: string };

const getFirstFallback = (
  strategy: Array<LoadStrategy>,
  currentState: Record<string, boolean>,
  metadata: ImageRequestObject
): LoadStrategy => {
  for (const strategyItem of strategy) {
    const isArtifactUri = isDefined(metadata.artifactUri) && strategyItem.field === 'artifactUri';
    const isDisplayUri = isDefined(metadata.displayUri) && strategyItem.field === 'displayUri';
    const isThumbnailUri = isDefined(metadata.thumbnailUri) && strategyItem.field === 'thumbnailUri';
    if ((isArtifactUri || isDisplayUri || isThumbnailUri) && !currentState[strategyItem.type]) {
      return strategyItem;
    }
  }

  return strategy[0];
};

export const CollectibleIcon: FC<CollectibleIconProps> = ({ collectible, size }) => {
  const styles = useCollectibleIconStyles();
  const [isLoaded, setIsLoaded] = useState(false);
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
        <Image
          style={styles.image}
          source={{
            uri: imageSrc,
            width: size,
            height: size
          }}
          blurRadius={isLoaded ? 0 : 5}
          onError={handleLoadingFailed}
          onLoadEnd={() => setIsLoaded(true)}
        />
      )}
    </View>
  );
};
