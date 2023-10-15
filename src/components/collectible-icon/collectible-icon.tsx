import React, { useMemo, memo } from 'react';
import FastImage from 'react-native-fast-image';

import { AnimatedSvg } from 'src/components/animated-svg/animated-svg';
import { SimpleModelView } from 'src/components/simple-model-view/simple-model-view';
import { SimplePlayer } from 'src/components/simple-player/simple-player';
import { EventFn } from 'src/config/general';
import { formatCollectibleObjktArtifactUri, isImgUriDataUri } from 'src/utils/image.utils';

import { ActivityIndicator } from '../activity-indicator/activity-indicator';
import { AudioPlaceholderTheme } from '../audio-placeholder/audio-placeholder';
import { useCollectibleIconStyles } from './collectible-icon.styles';
import { AudioPlayer } from './components/audio-player/audio-player';
import { BrokenImage } from './components/broken-image/broken-image';
import { COLLECTIBLE_FINAL_FALLBACK } from './constants';
import { useCollectibleImageControl } from './hooks/use-collectible-image-control.hook';

interface Props extends StaticCollectibleIconProps {
  displayUri?: string;
  mime?: string;
  audioPlaceholderTheme?: AudioPlaceholderTheme;
  setScrollEnabled?: EventFn<boolean>;
}

export const CollectibleMediaImage = memo<Props>(
  ({ slug, artifactUri, displayUri, mime, size, isBigIcon = false, audioPlaceholderTheme, setScrollEnabled }) => {
    const styles = useCollectibleIconStyles();

    const {
      currentFallback,
      isLoading,
      isAnimatedRenderedOnce,
      handleAnimatedError,
      handleAudioError,
      handleError,
      handleLoadEnd
    } = useCollectibleImageControl(slug, artifactUri, isBigIcon);

    const finalImage = useMemo(() => {
      if (currentFallback === COLLECTIBLE_FINAL_FALLBACK) {
        return <BrokenImage isBigIcon={isBigIcon} style={styles.image} />;
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
    }, [mime, artifactUri, currentFallback, isAnimatedRenderedOnce, isLoading, displayUri, isBigIcon]);

    return (
      <>
        {finalImage}

        {isLoading ? <ActivityIndicator size={isBigIcon ? 'large' : 'small'} /> : null}
      </>
    );
  }
);

interface StaticCollectibleIconProps {
  slug: string;
  artifactUri?: string;
  size: number;
  isBigIcon?: boolean;
}

export const StaticCollectibleImage = memo<StaticCollectibleIconProps>(
  ({ slug, artifactUri, size, isBigIcon = false }) => {
    const styles = useCollectibleIconStyles();

    const { currentFallback, isLoading, handleError, handleLoadEnd } = useCollectibleImageControl(
      slug,
      artifactUri,
      isBigIcon
    );

    const finalImage = useMemo(() => {
      if (currentFallback === COLLECTIBLE_FINAL_FALLBACK) {
        return <BrokenImage isBigIcon={isBigIcon} style={styles.image} />;
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
    }, [currentFallback, isBigIcon, size, styles.image, handleError, handleLoadEnd]);

    return (
      <>
        {finalImage}

        {isLoading ? <ActivityIndicator size={isBigIcon ? 'large' : 'small'} /> : null}
      </>
    );
  }
);
