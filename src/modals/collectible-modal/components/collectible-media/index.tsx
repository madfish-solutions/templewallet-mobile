import React, { useMemo, memo } from 'react';
import FastImage from 'react-native-fast-image';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { AnimatedSvg } from 'src/components/animated-svg/animated-svg';
import { AudioPlaceholderTheme } from 'src/components/audio-placeholder';
import { BrokenImage } from 'src/components/broken-image';
import { SimpleModelView } from 'src/components/simple-model-view/simple-model-view';
import { SimplePlayer } from 'src/components/simple-player/simple-player';
import { formatCollectibleObjktArtifactUri, isImgUriDataUri } from 'src/utils/image.utils';

import { AudioPlayer } from './audio-player';
import { useCollectibleIconStyles } from './styles';
import { COLLECTIBLE_FINAL_FALLBACK, useCollectibleImageControl } from './use-image-control';

interface Props {
  slug: string;
  artifactUri?: string;
  displayUri?: string;
  size: number;
  mime?: string;
  audioPlaceholderTheme?: AudioPlaceholderTheme;
  setScrollEnabled?: SyncFn<boolean>;
}

export const CollectibleMedia = memo<Props>(
  ({ slug, artifactUri, displayUri, mime, size, audioPlaceholderTheme, setScrollEnabled }) => {
    const styles = useCollectibleIconStyles();

    const {
      currentFallback,
      isLoading,
      isAnimatedRenderedOnce,
      handleAnimatedError,
      handleAudioError,
      handleError,
      handleLoadEnd
    } = useCollectibleImageControl(slug, artifactUri, displayUri);

    const finalImage = useMemo(() => {
      if (currentFallback === COLLECTIBLE_FINAL_FALLBACK) {
        return <BrokenImage isBigIcon={true} style={styles.brokenImage} />;
      }

      if (!isAnimatedRenderedOnce && artifactUri) {
        if (isImgUriDataUri(artifactUri)) {
          return (
            <AnimatedSvg
              style={styles.image}
              dataUri={artifactUri}
              onError={handleAnimatedError}
              onLoadEnd={handleLoadEnd}
            />
          );
        }

        if (mime) {
          if (mime === 'model/gltf-binary') {
            return (
              <SimpleModelView
                uri={formatCollectibleObjktArtifactUri(artifactUri)}
                isBinary={true}
                style={styles.image}
                onError={handleAnimatedError}
                onLoadEnd={handleLoadEnd}
                setScrollEnabled={setScrollEnabled}
              />
            );
          }

          if (mime === 'application/x-directory') {
            return (
              <SimpleModelView
                uri={formatCollectibleObjktArtifactUri(artifactUri)}
                isBinary={false}
                style={styles.image}
                onError={handleAnimatedError}
                onLoadEnd={handleLoadEnd}
                setScrollEnabled={setScrollEnabled}
              />
            );
          }

          if (mime.startsWith('video/')) {
            return (
              <SimplePlayer
                uri={formatCollectibleObjktArtifactUri(artifactUri)}
                size={size}
                style={styles.image}
                onError={handleAnimatedError}
                onLoad={handleLoadEnd}
              />
            );
          }

          if (mime.startsWith('audio/')) {
            return (
              <AudioPlayer
                artifactUri={artifactUri}
                displayUri={displayUri}
                audioPlaceholderTheme={audioPlaceholderTheme}
                handleAudioError={handleAudioError}
                handleLoadEnd={handleLoadEnd}
              >
                <FastImage
                  style={[styles.image, { height: size, width: size }]}
                  source={{ uri: currentFallback }}
                  resizeMode="contain"
                  onError={handleError}
                  onLoad={handleLoadEnd}
                />
              </AudioPlayer>
            );
          }
        }
      }

      return (
        <FastImage
          style={[styles.image, { height: size, width: size }]}
          source={{ uri: currentFallback }}
          resizeMode="contain"
          onError={handleError}
          onLoad={handleLoadEnd}
        />
      );
    }, [mime, artifactUri, currentFallback, isAnimatedRenderedOnce, isLoading, displayUri]);

    return (
      <>
        {finalImage}

        {isLoading ? <ActivityIndicator size={'large'} /> : null}
      </>
    );
  }
);
