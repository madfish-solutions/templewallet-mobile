import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { AnimatedSvg } from 'src/components/animated-svg/animated-svg';
import { AudioPlaceholder } from 'src/components/audio-placeholder/audio-placeholder';
import { Icon } from 'src/components/icon/icon';
import { SimpleModelView } from 'src/components/simple-model-view/simple-model-view';
import { SimplePlayer } from 'src/components/simple-player/simple-player';
import { NonStaticMimeTypes } from 'src/enums/animated-mime-types.enum';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import {
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktMediumUri,
  formatImgUri,
  ImageResolutionEnum,
  isImgUriDataUri
} from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { IconNameEnum } from '../icon/icon-name.enum';
import { ImageBlurOverlay } from '../image-blur-overlay/image-blur-overlay';
import { CollectibleIconProps, CollectibleIconSize } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

const FINAL_FALLBACK = 'FINAL_FALLBACK';

export const CollectibleIcon: FC<CollectibleIconProps> = memo(
  ({
    collectible,
    size,
    iconSize = CollectibleIconSize.SMALL,
    mime,
    objktArtifact,
    setScrollEnabled,
    blurLayoutTheme,
    isTouchableBlurOverlay
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isShowBlur, setIsShowBlur] = useState(collectible.isAdultContent ?? false);

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
    const handleAudioError = useCallback(() => showErrorToast({ description: 'Invalid audio' }), []);

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
              style={styles.image}
              onError={handleAnimatedError}
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
                onError={handleAudioError}
                onLoad={handleLoadEnd}
              />
              <AudioPlaceholder />
            </>
          );
        }
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
          style={styles.image}
          source={{ uri: currentFallback }}
          onError={handleError}
          onLoad={handleLoadEnd}
        />
      );
    }, [mime, objktArtifact, currentFallback]);

    const imageWithBlur = useMemo(() => {
      if (Boolean(collectible.isAdultContent) && currentFallback !== FINAL_FALLBACK) {
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
    }, [image, collectible.isAdultContent, isShowBlur, currentFallback]);

    return (
      <View
        style={{
          width: size,
          height: size,
          padding: formatSize(2)
        }}
      >
        {imageWithBlur}
        {isLoading && !Boolean(isShowBlur) && (
          <View style={styles.loader}>
            <ActivityIndicator size={isBigIcon ? 'large' : 'small'} />
          </View>
        )}
      </View>
    );
  }
);
