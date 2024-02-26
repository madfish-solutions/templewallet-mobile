import { useIsFocused } from '@react-navigation/native';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import { isAndroid } from 'src/config/system';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
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
  onLoad?: SyncFn<PromotionProviderEnum>;
  onLayout?: ViewProps['onLayout'];
}

export const GenericPromotionItem = forwardRef<View, Props>(
  (
    {
      id,
      style,
      shouldShowCloseButton = true,
      variant = PromotionVariantEnum.Image,
      shouldTryHypelabAd = true,
      onError,
      onLoad,
      onLayout,
      ...testIDProps
    },
    ref
  ) => {
    const isImageAd = variant === PromotionVariantEnum.Image;
    const styles = useGenericPromotionItemStyles();
    const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
    const { isHiddenTemporarily, hidePromotion } = useAdTemporaryHiding(id);
    const isFocused = useIsFocused();

    const [adsState, setAdsState] = useState({
      currentProvider: PromotionProviderEnum.Optimal,
      adError: false,
      adIsReady: false
    });
    const { adError, currentProvider, adIsReady } = adsState;

    useEffect(() => {
      if (!isFocused) {
        setAdsState({
          currentProvider: PromotionProviderEnum.Optimal,
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
      setAdsState(prevState => ({ ...prevState, currentProvider: PromotionProviderEnum.HypeLab }));
    }, [handleAdError, shouldTryHypelabAd]);
    const handleHypelabError = useCallback(() => {
      handleAdError();
    }, [handleAdError]);

    const handleAdReadyFactory = useCallback(
      (provider: PromotionProviderEnum) => () => {
        setAdsState(prevState => ({ ...prevState, adIsReady: true, currentProvider: provider }));
        onLoad && onLoad(provider);
      },
      [onLoad]
    );
    const handleOptimalAdReady = useMemo(
      () => handleAdReadyFactory(PromotionProviderEnum.Optimal),
      [handleAdReadyFactory]
    );
    const handleHypelabAdReady = useMemo(
      () => handleAdReadyFactory(PromotionProviderEnum.HypeLab),
      [handleAdReadyFactory]
    );

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
        ref={ref}
        onLayout={onLayout}
      >
        {currentProvider === PromotionProviderEnum.Optimal && isFocused && (
          <NewOptimalPromotion
            {...testIDProps}
            variant={variant}
            isVisible={adIsReady}
            shouldShowCloseButton={shouldShowCloseButton}
            onClose={hidePromotion}
            onReady={handleOptimalAdReady}
            onError={handleOptimalError}
          />
        )}
        {currentProvider === PromotionProviderEnum.HypeLab && shouldTryHypelabAd && isFocused && (
          <NewHypelabPromotion
            {...testIDProps}
            variant={variant}
            isVisible={adIsReady}
            shouldShowCloseButton={shouldShowCloseButton}
            onClose={hidePromotion}
            onReady={handleHypelabAdReady}
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
