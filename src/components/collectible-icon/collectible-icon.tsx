import React, { FC, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { AnimatedSvg } from 'src/components/animated-svg/animated-svg';
import { AudioPlaceholder } from 'src/components/audio-placeholder/audio-laceholder';
import { SimpleModelView } from 'src/components/simple-model-view/simple-model-view';
import { SimplePlayer } from 'src/components/simple-player/simple-player';
import { NonStaticMimeTypes } from 'src/enums/animated-mime-types.enum';
import { formatSize } from 'src/styles/format-size';
import {
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktMediumUri,
  formatImgUri,
  isImgUriDataUri
} from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { showErrorToast } from '../../toast/toast.utils';
import { CollectibleIconProps, CollectibleIconSize } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

export const CollectibleIcon: FC<CollectibleIconProps> = ({
  collectible,
  size,
  iconSize = CollectibleIconSize.SMALL,
  mime,
  objktArtifact
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const isBigIcon = iconSize === CollectibleIconSize.BIG;
  const styles = useCollectibleIconStyles();
  const assetSlug = `${collectible.address}_${collectible.id}`;

  const initialFallback = useMemo(() => {
    if (isDefined(collectible.artifactUri) && isBigIcon) {
      return formatCollectibleObjktArtifactUri(collectible.artifactUri);
    }

    return formatCollectibleObjktMediumUri(assetSlug);
  }, []);

  const [isAnimatedIconError, setIsAnimatedIconError] = useState(false);
  const [currentFallback, setCurrentFallback] = useState(initialFallback);

  const handleError = () => {
    if (isDefined(mime) && mime.includes('image')) {
      setCurrentFallback(
        formatImgUri(isDefined(collectible.artifactUri) ? collectible.artifactUri : collectible.thumbnailUri, 'medium')
      );
    } else {
      setCurrentFallback(formatCollectibleObjktMediumUri(assetSlug));
    }
  };

  const handleAnimatedIconError = () => {
    setCurrentFallback(formatCollectibleObjktMediumUri(assetSlug));
    setIsAnimatedIconError(true);
  };

  const handleLoadEnd = () => setIsLoading(false);

  const icon = useMemo(() => {
    if (!isAnimatedIconError && isDefined(objktArtifact) && isBigIcon) {
      if (isImgUriDataUri(objktArtifact)) {
        return (
          <AnimatedSvg
            style={styles.image}
            dataUri={objktArtifact}
            onError={handleAnimatedIconError}
            onLoadEnd={handleLoadEnd}
          />
        );
      }

      if (mime === NonStaticMimeTypes.MODEL) {
        return (
          <SimpleModelView
            style={styles.image}
            uri={formatCollectibleObjktArtifactUri(objktArtifact)}
            onError={handleAnimatedIconError}
            onLoadEnd={handleLoadEnd}
          />
        );
      }

      if (mime === NonStaticMimeTypes.VIDEO) {
        return (
          <SimplePlayer
            uri={formatCollectibleObjktArtifactUri(objktArtifact)}
            size={size}
            style={styles.image}
            onError={handleAnimatedIconError}
            onLoad={handleLoadEnd}
          />
        );
      }

      if (mime === NonStaticMimeTypes.AUDIO) {
        return (
          <>
            <SimplePlayer
              uri={formatCollectibleObjktArtifactUri(objktArtifact)}
              size={size}
              onError={() => showErrorToast({ description: 'Invalid audio' })}
              onLoad={handleLoadEnd}
            />
            <AudioPlaceholder size="large" />
          </>
        );
      }
    }

    if (mime === NonStaticMimeTypes.AUDIO && !isBigIcon) {
      return <AudioPlaceholder />;
    }

    return (
      <FastImage
        style={styles.image}
        source={{ uri: currentFallback }}
        onError={handleError}
        onLoadEnd={handleLoadEnd}
      />
    );
  }, [mime, objktArtifact, currentFallback]);

  return (
    <View
      style={{
        width: size,
        height: size,
        padding: formatSize(2)
      }}
    >
      {icon}
      {isLoading && (
        <View style={[styles.loader]}>
          <ActivityIndicator size={iconSize === CollectibleIconSize.SMALL ? 'small' : 'large'} />
        </View>
      )}
    </View>
  );
};
