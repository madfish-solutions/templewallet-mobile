import React, { memo } from 'react';
import FastImage from 'react-native-fast-image';

import { ActivityIndicator } from '../activity-indicator';
import { BrokenImage } from '../broken-image';
import { useCollectibleImageStyles } from './styles';
import { useCollectibleImagesStack } from './use-images-stack';

interface Props {
  slug: string;
  artifactUri?: string;
  displayUri?: string;
  size: number;
  isFullView?: boolean;
}

export const CollectibleImage = memo<Props>(({ slug, artifactUri, displayUri, size, isFullView = false }) => {
  const styles = useCollectibleImageStyles();

  const { src, isStackFailed, isLoading, onSuccess, onFail } = useCollectibleImagesStack(
    slug,
    artifactUri,
    displayUri,
    isFullView
  );

  if (isStackFailed) {
    return <BrokenImage isBigIcon={isFullView} style={styles.brokenImage} />;
  }

  return (
    <>
      <FastImage
        style={[styles.image, { height: size, width: size }]}
        source={{ uri: src }}
        resizeMode="contain"
        onError={onFail}
        onLoad={onSuccess}
      />

      {isLoading ? <ActivityIndicator size={isFullView ? 'large' : 'small'} /> : null}
    </>
  );
});
