import { useIsFocused } from '@react-navigation/native';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { HypelabPromotion } from 'src/components/hypelab-promotion';
import { OptimalPromotion } from 'src/components/optimal-promotion';
import { PersonaPromotion } from 'src/components/persona-promotion';
import { PROMO_SYNC_INTERVAL } from 'src/config/fixed-times';
import { isAndroid } from 'src/config/system';
import { PromotionProviderEnum } from 'src/enums/promotion-provider.enum';
import { PromotionVariantEnum } from 'src/enums/promotion-variant.enum';
import { useAdTemporaryHiding } from 'src/hooks/use-ad-temporary-hiding.hook';
import { useAuthorisedInterval } from 'src/hooks/use-authed-interval';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';

import { usePromotionItemStyles } from './styles';

interface Props {
  id: string;
  style?: StyleProp<ViewStyle>;
  shouldRefreshAd?: boolean;
  shouldShowCloseButton?: boolean;
  onlyOptimalAd?: boolean;
  variant?: PromotionVariantEnum;
  testID: string;
  pageName: string;
  onError?: EmptyFn;
  onLoad?: SyncFn<PromotionProviderEnum>;
  onLayout?: ViewProps['onLayout'];
}

export const PromotionItem = forwardRef<View, Props>(
  (
    {
      id,
      style,
      shouldRefreshAd = false,
      shouldShowCloseButton = true,
      testID,
      variant = PromotionVariantEnum.Image,
      onlyOptimalAd = false,
      pageName,
      onError,
      onLoad,
      onLayout
    },
    ref
  ) => {
    const accountPkh = useCurrentAccountPkhSelector();

    const isImageAd = variant === PromotionVariantEnum.Image;
    const styles = usePromotionItemStyles();
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

    useAuthorisedInterval(
      () => {
        if (!shouldRefreshAd || !partnersPromotionEnabled || isHiddenTemporarily) {
          return;
        }

        setAdsState({
          currentProvider: PromotionProviderEnum.Optimal,
          adError: false,
          adIsReady: false
        });
      },
      PROMO_SYNC_INTERVAL,
      [partnersPromotionEnabled, isHiddenTemporarily, shouldRefreshAd]
    );

    const handleAdError = useCallback(() => {
      setAdsState(prevState => ({ ...prevState, adError: true }));
      onError && onError();
    }, [onError]);

    const handleOptimalError = useCallback(() => {
      if (onlyOptimalAd) {
        handleAdError();
      } else {
        setAdsState(prevState => ({ ...prevState, currentProvider: PromotionProviderEnum.HypeLab }));
      }
    }, [handleAdError, onlyOptimalAd]);
    const handleHypelabError = useCallback(() => {
      if (variant === PromotionVariantEnum.Text) {
        handleAdError();
      } else {
        setAdsState(prevState => ({ ...prevState, currentProvider: PromotionProviderEnum.Persona }));
      }
    }, [handleAdError, variant]);

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
    const handlePersonaAdReady = useMemo(
      () => handleAdReadyFactory(PromotionProviderEnum.Persona),
      [handleAdReadyFactory]
    );

    const testIDProperties = useMemo(
      () => ({
        variant,
        provider: currentProvider,
        page: pageName,
        accountPkh
      }),
      [currentProvider, variant, pageName, accountPkh]
    );

    if (!partnersPromotionEnabled || adError || isHiddenTemporarily) {
      return null;
    }

    const promotionCommonProps = {
      testID,
      testIDProperties,
      variant,
      isVisible: adIsReady,
      shouldShowCloseButton,
      onClose: hidePromotion
    };

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
          <OptimalPromotion
            {...promotionCommonProps}
            shouldRefreshAd={shouldRefreshAd}
            onReady={handleOptimalAdReady}
            onError={handleOptimalError}
          />
        )}
        {currentProvider === PromotionProviderEnum.HypeLab && isFocused && (
          <HypelabPromotion {...promotionCommonProps} onReady={handleHypelabAdReady} onError={handleHypelabError} />
        )}
        {currentProvider === PromotionProviderEnum.Persona && isFocused && (
          <PersonaPromotion {...promotionCommonProps} onReady={handlePersonaAdReady} onError={handleAdError} />
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
