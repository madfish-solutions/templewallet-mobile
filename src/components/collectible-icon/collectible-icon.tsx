import React, { FC, useMemo, useState, memo, useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { AnimatedSvg } from 'src/components/animated-svg/animated-svg';
import { AudioPlaceholder } from 'src/components/audio-placeholder/audio-placeholder';
import { SimpleModelView } from 'src/components/simple-model-view/simple-model-view';
import { SimplePlayer } from 'src/components/simple-player/simple-player';
import { NonStaticMimeTypes } from 'src/enums/animated-mime-types.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import {
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktMediumUri,
  formatImgUri,
  ImageResolutionEnum,
  isImgUriDataUri
} from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { useCollectibleDetailsSelector } from '../../store/collectibles/collectibles-selectors';
import { formatSize } from '../../styles/format-size';
import { getTokenSlug } from '../../token/utils/token.utils';
import { isAdultCollectible } from '../../utils/collectibles.utils';
import { ActivityIndicator } from '../activity-indicator/activity-indicator';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { ImageBlurOverlay } from '../image-blur-overlay/image-blur-overlay';
import { CollectibleIconProps, CollectibleIconSize } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

const FINAL_FALLBACK = 'FINAL_FALLBACK';

export const CollectibleIcon: FC<CollectibleIconProps> = memo(
  ({
    collectible,
    paused,
    size,
    iconSize = CollectibleIconSize.SMALL,
    mime,
    objktArtifact,
    audioPlaceholderTheme,
    setScrollEnabled,
    blurLayoutTheme,
    isTouchableBlurOverlay,
    isShowInfo = false
  }) => {
    const collectibleDetails = useCollectibleDetailsSelector(getTokenSlug(collectible));

    const isShowBlurInitialValue = useMemo(() => {
      if (isDefined(collectibleDetails)) {
        return isAdultCollectible(collectibleDetails.attributes, collectibleDetails.tags);
      }

      return false;
    }, [collectibleDetails]);

    const [isLoading, setIsLoading] = useState(true);
    const [isShowBlur, setIsShowBlur] = useState(isShowBlurInitialValue);

    useEffect(() => void setIsShowBlur(isShowBlurInitialValue), [collectibleDetails]);

    const isBigIcon = iconSize === CollectibleIconSize.BIG;
    const styles = useCollectibleIconStyles();
    const assetSlug = `${collectible.address}_${collectible.id}`;

    const imageFallbackURLs = useMemo(
      () => [
        formatCollectibleObjktArtifactUri(collectible.artifactUri ?? ''),
        formatCollectibleObjktMediumUri(assetSlug),
        formatImgUri(collectible.artifactUri, ImageResolutionEnum.MEDIUM)
      ],
      [collectible]
    );

    const [isAnimatedRenderedOnce, setIsAnimatedRenderedOnce] = useState(false);
    const [currentFallbackIndex, setCurrentFallbackIndex] = useState(isBigIcon ? 0 : 1);
    const [currentFallback, setCurrentFallback] = useState(imageFallbackURLs[currentFallbackIndex]);

    const handleError = useCallback(() => {
      if (currentFallbackIndex < imageFallbackURLs.length - 1) {
        setCurrentFallback(imageFallbackURLs[currentFallbackIndex + 1]);
        setCurrentFallbackIndex(prevState => prevState + 1);
      } else {
        setCurrentFallback(FINAL_FALLBACK);
        handleLoadEnd();
      }
    }, [currentFallbackIndex, imageFallbackURLs]);

    const handleAnimatedError = useCallback(() => setIsAnimatedRenderedOnce(true), []);
    const handleLoadEnd = useCallback(() => setIsLoading(false), []);
    const handleAudioError = useCallback(() => {
      showErrorToast({ description: 'Invalid audio' });
      setIsLoading(false);
    }, []);

    const finalFallbackIconWidth = useMemo(() => formatSize(isBigIcon ? 72 : 38), [isBigIcon]);
    const finalFallbackIconHeight = useMemo(() => formatSize(isBigIcon ? 90 : 48), [isBigIcon]);

    const image = useMemo(() => {
      if (!isAnimatedRenderedOnce && isDefined(objktArtifact) && isBigIcon) {
        if (isImgUriDataUri(objktArtifact)) {
          return (
            <AnimatedSvg
              style={styles.image}
              dataUri={objktArtifact}
              onError={handleAnimatedError}
              onLoadEnd={handleLoadEnd}
            />
          );
        }

        if (mime === NonStaticMimeTypes.MODEL || mime === NonStaticMimeTypes.INTERACTIVE) {
          return (
            <SimpleModelView
              uri={formatCollectibleObjktArtifactUri(objktArtifact)}
              isBinary={mime === NonStaticMimeTypes.MODEL}
              style={styles.image}
              onError={handleAnimatedError}
              onLoadEnd={handleLoadEnd}
              setScrollEnabled={setScrollEnabled}
            />
          );
        }

        if (mime === NonStaticMimeTypes.VIDEO) {
          return (
            <SimplePlayer
              uri={formatCollectibleObjktArtifactUri(objktArtifact)}
              size={size}
              paused={paused}
              style={styles.image}
              onError={handleAnimatedError}
              onLoad={handleLoadEnd}
            />
          );
        }
      }

      if (isDefined(objktArtifact) && isDefined(mime) && mime.includes(NonStaticMimeTypes.AUDIO)) {
        return (
          <>
            <SimplePlayer
              uri={formatCollectibleObjktArtifactUri(objktArtifact)}
              size={size}
              paused={paused}
              onError={handleAudioError}
              onLoad={handleLoadEnd}
            />
            <AudioPlaceholder theme={audioPlaceholderTheme} />
          </>
        );
      }

      if (currentFallback === FINAL_FALLBACK) {
        return (
          <View style={styles.image}>
            <Icon name={IconNameEnum.BrokenImage} width={finalFallbackIconWidth} height={finalFallbackIconHeight} />
          </View>
        );
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
    }, [mime, objktArtifact, currentFallback, isAnimatedRenderedOnce]);

    const imageWithBlur = useMemo(() => {
      if (isShowBlur && currentFallback !== FINAL_FALLBACK) {
        return (
          <ImageBlurOverlay
            theme={blurLayoutTheme}
            size={size}
            isShowBlur={isShowBlur}
            setIsShowBlur={setIsShowBlur}
            isTouchableOverlay={isTouchableBlurOverlay}
          >
            {image}
          </ImageBlurOverlay>
        );
      }

      return image;
    }, [image, isShowBlur, currentFallback]);

    return (
      <View
        style={{
          width: size,
          height: size
        }}
      >
        {imageWithBlur}
        {Boolean(isShowInfo) && (
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>{collectible.balance}</Text>
            <Icon name={IconNameEnum.Action} size={formatSize(8)} />
          </View>
        )}
        {isLoading && !Boolean(isShowBlur) && <ActivityIndicator size={isBigIcon ? 'large' : 'small'} />}
      </View>
    );
  }
);
