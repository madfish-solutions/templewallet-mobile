import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import FastImage from 'react-native-fast-image';
import useSWR from 'swr';

import { ImagePromotionView } from 'src/components/image-promotion-view';
import { TextPromotionView } from 'src/components/text-promotion-view';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { SingleProviderPromotionProps } from 'src/types/promotion';
import { useDidMount } from 'src/utils/hooks/use-did-mount';
import { isDefined } from 'src/utils/is-defined';
import { getOptimalPromotion, OptimalPromotionAdType, useIsEmptyPromotion } from 'src/utils/optimal.utils';

import { useOptimalPromotionStyles } from './styles';

interface SelfRefreshingPromotionProps {
  shouldRefreshAd: boolean;
}

export const OptimalPromotion: FC<SingleProviderPromotionProps & SelfRefreshingPromotionProps> = ({
  variant,
  isVisible,
  shouldShowCloseButton,
  onClose,
  onReady,
  onError,
  ...testIDProps
}) => {
  const isImageAd = variant === PromotionVariantEnum.Image;
  const styles = useOptimalPromotionStyles();
  const accountPkh = useCurrentAccountPkhSelector();

  const localGetOptimalPromotion = useCallback(
    () => getOptimalPromotion(isImageAd ? OptimalPromotionAdType.TwMobile : OptimalPromotionAdType.TwToken, accountPkh),
    [accountPkh, isImageAd]
  );
  const {
    data: promo,
    error,
    isValidating,
    mutate
  } = useSWR(['optimal-promotion', accountPkh, isImageAd], localGetOptimalPromotion);
  const prevIsValidatingRef = useRef(isValidating);

  const [isImageBroken, setIsImageBroken] = useState(false);
  const [adViewIsReady, setAdViewIsReady] = useState(isImageAd);
  const promotionIsEmpty = useIsEmptyPromotion(promo);

  useDidMount(() => {
    if (!isValidating) {
      mutate();
    }
  });

  useEffect(() => {
    if (isDefined(error) || promotionIsEmpty) {
      onError();
    } else if (!promotionIsEmpty && promo && adViewIsReady) {
      onReady();
    }
    prevIsValidatingRef.current = isValidating;
  }, [onError, onReady, promotionIsEmpty, adViewIsReady, error, promo, isValidating]);

  const onImageError = useCallback(() => {
    setIsImageBroken(true);
    onError();
  }, [onError]);

  const handleTextPromotionReady = useCallback(() => setAdViewIsReady(true), []);

  if (isDefined(error) || promotionIsEmpty || isImageBroken || !promo) {
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
