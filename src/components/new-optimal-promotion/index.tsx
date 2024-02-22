import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import FastImage from 'react-native-fast-image';

import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import {
  usePartnersPromoErrorSelector,
  usePartnersPromoLoadingSelector,
  usePartnersPromoSelector
} from 'src/store/partners-promotion/partners-promotion-selectors';
import { SingleProviderPromotionProps } from 'src/types/promotion';
import { useTimeout } from 'src/utils/hooks';
import { isDefined } from 'src/utils/is-defined';
import { useIsEmptyPromotion } from 'src/utils/optimal.utils';

import { ImagePromotionView } from '../image-promotion-view';
import { TextPromotionView } from '../text-promotion-view';

import { useNewOptimalPromotionStyles } from './styles';

export const NewOptimalPromotion: FC<SingleProviderPromotionProps> = ({
  variant,
  isVisible,
  shouldShowCloseButton,
  onClose,
  onReady,
  onError,
  ...testIDProps
}) => {
  const isImageAd = variant === PromotionVariantEnum.Image;
  const styles = useNewOptimalPromotionStyles();
  const promo = usePartnersPromoSelector();
  const isLoading = usePartnersPromoLoadingSelector();
  const errorFromStore = usePartnersPromoErrorSelector();
  const [isImageBroken, setIsImageBroken] = useState(false);
  const [wasLoading, setWasLoading] = useState(false);
  const [shouldPreventShowingPrevAd, setShouldPreventShowingPrevAd] = useState(true);
  const [adViewIsReady, setAdViewIsReady] = useState(isImageAd);
  const prevIsLoadingRef = useRef(isLoading);
  const promotionIsEmpty = useIsEmptyPromotion(promo);
  const apiQueryFailed = (isDefined(errorFromStore) || promotionIsEmpty) && wasLoading;
  const adIsNotLikelyToLoad = (isDefined(errorFromStore) || promotionIsEmpty) && !isLoading;

  useTimeout(
    () => {
      if (adIsNotLikelyToLoad) {
        onError();
      }
    },
    2000,
    [adIsNotLikelyToLoad, onError]
  );

  useEffect(() => {
    if (wasLoading) {
      setShouldPreventShowingPrevAd(false);
    }
  }, [wasLoading]);
  useTimeout(() => setShouldPreventShowingPrevAd(false), 2000, []);

  useEffect(() => {
    if (!isLoading && prevIsLoadingRef.current) {
      setWasLoading(true);
    }
    prevIsLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (apiQueryFailed) {
      onError();
    } else if (!promotionIsEmpty && !shouldPreventShowingPrevAd && adViewIsReady) {
      onReady();
    }
  }, [apiQueryFailed, onError, onReady, promotionIsEmpty, shouldPreventShowingPrevAd, adViewIsReady]);

  const onImageError = useCallback(() => {
    setIsImageBroken(true);
    onError();
  }, [onError]);

  const handleTextPromotionReady = useCallback(() => setAdViewIsReady(true), []);

  if (isDefined(errorFromStore) || promotionIsEmpty || isImageBroken || shouldPreventShowingPrevAd) {
    return null;
  }

  const { link: href, image: imageSrc, copy } = promo;
  const { headline, content } = copy;

  if (isImageAd) {
    return (
      <ImagePromotionView
        onClose={onClose}
        shouldShowCloseButton={shouldShowCloseButton}
        href={href}
        isVisible={isVisible}
        shouldShowAdBage
        {...testIDProps}
      >
        <FastImage style={styles.bannerImage} source={{ uri: imageSrc }} onError={onImageError} />
      </ImagePromotionView>
    );
  }

  return (
    <TextPromotionView
      href={href}
      isVisible={isVisible}
      imageSrc={imageSrc}
      headline={headline}
      contentText={content}
      shouldShowCloseButton={shouldShowCloseButton}
      onImageError={onImageError}
      onClose={onClose}
      onReady={handleTextPromotionReady}
    />
  );
};
