import React, { FC, useMemo, useState, memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';

import { AnimatedSvg } from 'src/components/animated-svg/animated-svg';
import { SimpleModelView } from 'src/components/simple-model-view/simple-model-view';
import { SimplePlayer } from 'src/components/simple-player/simple-player';
import { EventFn } from 'src/config/general';
import { NonStaticMimeTypes } from 'src/enums/animated-mime-types.enum';
import { useCollectibleDetailsSelector } from 'src/store/collectibles/collectibles-selectors';
import { isAdultCollectible } from 'src/utils/collectibles.utils';
import {
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktDisplayUri,
  isImgUriDataUri
} from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { ActivityIndicator } from '../activity-indicator/activity-indicator';
import { AudioPlaceholderTheme } from '../audio-placeholder/audio-placeholder';
import { useCollectibleIconStyles } from './collectible-icon.styles';
import { AudioPlayer } from './components/audio-player/audio-player';
import { Balance } from './components/balance/balance';
import { BrokenImage } from './components/broken-image/broken-image';
import { ImageBlurOverlay } from './components/image-blur-overlay/image-blur-overlay';
import { COLLECTIBLE_FINAL_FALLBACK } from './constants';
import { useCollectibleImageControl } from './hooks/use-collectible-image-control.hook';

export interface CollectibleIconProps {
  slug: string;
  artifactUri?: string;
  displayUri?: string;
  mime: string;
  size: number;
  balance?: string;
  isBigIcon?: boolean;
  audioPlaceholderTheme?: AudioPlaceholderTheme;
  setScrollEnabled?: EventFn<boolean>;
  isTouchableBlurOverlay?: boolean;
  isModalWindow?: boolean;
  isShowInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const CollectibleIcon: FC<CollectibleIconProps> = memo(
  ({
    slug,
    artifactUri,
    displayUri,
    mime,
    size,
    isBigIcon = false,
    audioPlaceholderTheme,
    isTouchableBlurOverlay = false,
    isModalWindow = false,
    isShowInfo,
    balance,
    setScrollEnabled
  }) => {
    const styles = useCollectibleIconStyles();

    // TODO: Refactor this code. Add adult logic to epic.
    const collectibleDetails = useCollectibleDetailsSelector(slug);
    const isShowBlurInitialValue = useMemo(() => {
      if (isDefined(collectibleDetails)) {
        return isAdultCollectible(collectibleDetails.attributes, collectibleDetails.tags);
      }

      return false;
    }, [collectibleDetails]);
    const [isShowBlur, setIsShowBlur] = useState(isShowBlurInitialValue);
    // *

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

      if (isShowBlur) {
        return (
          <ImageBlurOverlay
            isBigIcon={isBigIcon}
            size={size}
            isShowBlur={isShowBlur}
            setIsShowBlur={setIsShowBlur}
            isTouchableOverlay={isTouchableBlurOverlay}
          />
        );
      }

      if (!isAnimatedRenderedOnce && isDefined(artifactUri) && isModalWindow) {
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

        if (mime === NonStaticMimeTypes.MODEL) {
          return (
            <SimpleModelView
              uri={formatCollectibleObjktArtifactUri(artifactUri)}
              isBinary={mime === NonStaticMimeTypes.MODEL}
              style={styles.image}
              onError={handleAnimatedError}
              onLoadEnd={handleLoadEnd}
              setScrollEnabled={setScrollEnabled}
            />
          );
        }

        if (mime === NonStaticMimeTypes.INTERACTIVE) {
          <SimpleModelView
            uri={formatCollectibleObjktDisplayUri(displayUri ?? artifactUri)}
            isBinary={false}
            style={styles.image}
            onError={handleAnimatedError}
            onLoadEnd={handleLoadEnd}
            setScrollEnabled={setScrollEnabled}
          />;
        }

        if (mime === NonStaticMimeTypes.VIDEO) {
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

        if (isDefined(mime) && mime.includes(NonStaticMimeTypes.AUDIO)) {
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

      return (
        <FastImage
          style={[styles.image, { height: size, width: size }]}
          source={{ uri: currentFallback }}
          resizeMode="contain"
          onError={handleError}
          onLoad={handleLoadEnd}
        />
      );
    }, [
      mime,
      artifactUri,
      currentFallback,
      isAnimatedRenderedOnce,
      isLoading,
      displayUri,
      isModalWindow,
      isShowBlur,
      isBigIcon,
      isTouchableBlurOverlay
    ]);

    return (
      <View
        style={[
          styles.root,
          {
            width: size,
            height: size
          }
        ]}
      >
        {finalImage}

        {isShowInfo && isDefined(balance) && <Balance balance={balance} />}

        {isLoading && !Boolean(isShowBlur) && <ActivityIndicator size={isBigIcon ? 'large' : 'small'} />}
      </View>
    );
  }
);
