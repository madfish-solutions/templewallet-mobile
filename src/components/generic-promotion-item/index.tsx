import { useIsFocused } from '@react-navigation/native';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { isAndroid } from 'src/config/system';
import { useAdTemporaryHiding } from 'src/hooks/use-ad-temporary-hiding.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';

import { PromotionVariantEnum } from '../../enums/promotion-variant.enum';
import { ActivityIndicator } from '../activity-indicator';
import { NewHypelabPromotion } from '../new-hypelab-promotion';
import { NewOptimalPromotion } from '../new-optimal-promotion';

import { useGenericPromotionItemStyles } from './styles';

interface Props extends TestIdProps {
  id: string;
  style?: StyleProp<ViewStyle>;
  shouldShowCloseButton?: boolean;
  shouldTryHypelabAd?: boolean;
  variant?: PromotionVariantEnum;
  onError?: EmptyFn;
}

export const GenericPromotionItem = memo<Props>(
  ({
    id,
    style,
    shouldShowCloseButton = true,
    variant = PromotionVariantEnum.Image,
    shouldTryHypelabAd = true,
    onError,
    ...testIDProps
  }) => {
    const isImageAd = variant === PromotionVariantEnum.Image;
    const styles = useGenericPromotionItemStyles();
    const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
    const { isHiddenTemporarily, hidePromotion } = useAdTemporaryHiding(id);
    const isFocused = useIsFocused();

    const [adsState, setAdsState] = useState({
      shouldUseOptimalAd: true,
      adError: false,
      adIsReady: false
    });
    const { adError, shouldUseOptimalAd, adIsReady } = adsState;

    useEffect(() => {
      if (!isFocused) {
        setAdsState({
          shouldUseOptimalAd: true,
          adError: false,
          adIsReady: false
        });
      }
    }, [isFocused]);

    const handleAdError = useCallback(() => {
      setAdsState(prevState => ({ ...prevState, adError: true }));
      onError && onError();
    }, [onError]);

    const handleOptimalError = useCallback(() => {
      if (!shouldTryHypelabAd) {
        handleAdError();
      }
      setAdsState(prevState => ({ ...prevState, shouldUseOptimalAd: false }));
    }, [handleAdError, shouldTryHypelabAd]);
    const handleHypelabError = useCallback(() => {
      handleAdError();
    }, [handleAdError]);

    const handleAdReady = useCallback(() => {
      setAdsState(prevState => ({ ...prevState, adIsReady: true }));
    }, []);

    if (!partnersPromotionEnabled || adError || isHiddenTemporarily) {
      return null;
    }

    return (
      <View
        style={[
          styles.container,
          isAndroid && styles.androidContainer,
          !adIsReady && (isImageAd ? styles.imgAdLoadingContainer : styles.textAdLoadingContainer),
          style
        ]}
      >
        {shouldUseOptimalAd && isFocused && (
          <NewOptimalPromotion
            {...testIDProps}
            variant={variant}
            isVisible={adIsReady}
            shouldShowCloseButton={shouldShowCloseButton}
            onClose={hidePromotion}
            onReady={handleAdReady}
            onError={handleOptimalError}
          />
        )}
        {!shouldUseOptimalAd && shouldTryHypelabAd && isFocused && (
          <NewHypelabPromotion
            {...testIDProps}
            variant={variant}
            isVisible={adIsReady}
            shouldShowCloseButton={shouldShowCloseButton}
            onClose={hidePromotion}
            onReady={handleAdReady}
            onError={handleHypelabError}
          />
        )}
        {!adIsReady && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  }
);
