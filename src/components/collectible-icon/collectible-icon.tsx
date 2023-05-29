import React, { FC, useMemo, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

import { AnimatedSvg } from 'src/components/animated-svg/animated-svg';
import { SimpleModelView } from 'src/components/simple-model-view/simple-model-view';
import { NonStaticMimeTypes } from 'src/enums/animated-mime-types.enum';
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

export const CollectibleIcon: FC<CollectibleIconProps> = ({
  collectible,
  size,
  iconSize = CollectibleIconSize.SMALL,
  mime,
  objktArtifact
}) => {
  const styles = useCollectibleIconStyles();
  const assetSlug = `${collectible.address}_${collectible.id}`;

  const initialFallback = useMemo(() => {
    if (isDefined(collectible.artifactUri) && iconSize === CollectibleIconSize.BIG) {
      return formatCollectibleObjktArtifactUri(collectible.artifactUri);
    }

    return formatCollectibleObjktMediumUri(assetSlug);
  }, []);

  const [isAnimatedIconError, setIsAnimatedIconError] = useState(false);
  const [currentFallback, setCurrentFallback] = useState(initialFallback);

  const handleError = () =>
    void setCurrentFallback(
      formatImgUri(isDefined(collectible.artifactUri) ? collectible.artifactUri : collectible.thumbnailUri, 'medium')
    );

  const handleAnimatedIconError = () => {
    setCurrentFallback(formatCollectibleObjktMediumUri(assetSlug));
    setIsAnimatedIconError(true);
  };

  const icon = useMemo(() => {
    if (!isAnimatedIconError && isDefined(objktArtifact)) {
      if (isImgUriDataUri(objktArtifact)) {
        return <AnimatedSvg style={styles.image} dataUri={objktArtifact} onError={handleAnimatedIconError} />;
      }

      if (mime === NonStaticMimeTypes.MODEL) {
        return (
          <SimpleModelView
            style={styles.image}
            uri={formatCollectibleObjktArtifactUri(objktArtifact)}
            onError={handleAnimatedIconError}
          />
        );
      }

      if (mime === NonStaticMimeTypes.VIDEO || mime === NonStaticMimeTypes.AUDIO) {
        return (
          <Video
            repeat
            source={{ uri: formatCollectibleObjktArtifactUri(objktArtifact) }}
            // @ts-ignore
            style={[{ width: size, height: size }, styles.image]}
            onError={handleAnimatedIconError}
          />
        );
      }
    }

    return <FastImage style={styles.image} source={{ uri: currentFallback }} onError={handleError} />;
  }, [objktArtifact, currentFallback]);

  return (
    <View
      style={{
        width: size,
        height: size,
        padding: formatSize(2)
      }}
    >
      {icon}
    </View>
  );
};
