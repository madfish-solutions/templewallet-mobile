import React, { FC, useMemo, useState, memo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { AnimatedSvg } from 'src/components/animated-svg/animated-svg';
import { AudioPlaceholder } from 'src/components/audio-placeholder/audio-placeholder';
import { SimpleModelView } from 'src/components/simple-model-view/simple-model-view';
import { SimplePlayer } from 'src/components/simple-player/simple-player';
import { NonStaticMimeTypes } from 'src/enums/animated-mime-types.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import {
  ImageResolutionEnum,
  formatCollectibleObjktArtifactUri,
  formatCollectibleObjktMediumUri,
  formatImgUri,
  isImgUriDataUri
} from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';

import { formatSize } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { ImageBlurOverlay } from '../image-blur-overlay/image-blur-overlay';
import { CollectibleIconProps, CollectibleIconSize } from './collectible-icon.props';
import { useCollectibleIconStyles } from './collectible-icon.styles';

export const CollectibleIcon: FC<CollectibleIconProps> = memo(
  ({
    collectible,
    size,
    iconSize = CollectibleIconSize.SMALL,
    mime,
    objktArtifact,
    setScrollEnabled,
    blurLayoutTheme,
    isTouchableBlurOverlay,
    isShowInfo = false
  }) => {
    const isAdultContent = collectible.isAdultContent ?? false;
    const [isLoading, setIsLoading] = useState(true);
    const [isShowBlur, setIsShowBlur] = useState(isAdultContent);

    const isBigIcon = iconSize === CollectibleIconSize.BIG;
    const styles = useCollectibleIconStyles();
    const assetSlug = `${collectible.address}_${collectible.id}`;

    const initialFallback = useMemo(() => {
      if (isDefined(collectible.artifactUri) && isBigIcon) {
        return formatCollectibleObjktArtifactUri(collectible.artifactUri);
      }

      return formatCollectibleObjktMediumUri(assetSlug);
    }, []);

    const [isAnimatedRenderedOnce, setIsAnimatedRenderedOnce] = useState(false);
    const [currentFallback, setCurrentFallback] = useState(initialFallback);
    const handleError = () => {
      setCurrentFallback(
        currentFallback.endsWith('/thumb288')
          ? formatImgUri(collectible.artifactUri, ImageResolutionEnum.MEDIUM)
          : formatCollectibleObjktMediumUri(assetSlug)
      );
    };

    const handleAnimatedError = () => {
      setIsAnimatedRenderedOnce(true);
      handleError();
    };
    const handleLoadEnd = () => void setIsLoading(false);

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
              posterUri={formatCollectibleObjktMediumUri(assetSlug)}
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
                onError={() => showErrorToast({ description: 'Invalid audio' })}
                onLoad={handleLoadEnd}
              />
              <AudioPlaceholder />
            </>
          );
        }
      }

      return (
        <FastImage
          style={[styles.image, { height: size, width: size }]}
          source={{ uri: currentFallback }}
          onError={handleError}
          onLoadEnd={handleLoadEnd}
        />
      );
    }, [mime, objktArtifact, currentFallback]);

    const imageWithBlur = useMemo(() => {
      if (Boolean(isAdultContent)) {
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
    }, [image, isAdultContent, isShowBlur]);

    return (
      <View
        style={{
          width: size,
          height: size
        }}
      >
        {imageWithBlur}
        {isShowInfo && (
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>{collectible.balance}</Text>
            <Icon name={IconNameEnum.Action} size={formatSize(8)} />
          </View>
        )}
        {isLoading && !isShowBlur && (
          <View style={styles.loader}>
            <ActivityIndicator size={iconSize === CollectibleIconSize.SMALL ? 'small' : 'large'} />
          </View>
        )}
      </View>
    );
  }
);
