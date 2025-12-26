import { useIsFocused } from '@react-navigation/native';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { HypelabPromotion } from 'src/components/hypelab-promotion';
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
  variant?: PromotionVariantEnum;
  testID: string;
  pageName: string;
  onError?: EmptyFn;
  onLoad?: SyncFn<PromotionProviderEnum>;
  onImpression?: SyncFn<PromotionProviderEnum>;
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
      pageName,
      onError,
      onLoad,
      onImpression,
      onLayout
    },
    ref
  ) => {
    const accountPkh = useCurrentAccountPkhSelector();

    const isImageAd = variant === PromotionVariantEnum.Image;
    const styles = usePromotionItemStyles();
    const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
    const isFocused = useIsFocused();

    const [adsState, setAdsState] = useState({
      currentProvider: PromotionProviderEnum.HypeLab,
      adError: false,
      adIsReady: false
    });
    const { adError, currentProvider, adIsReady } = adsState;

    const handleAdError = useCallback(() => {
      setAdsState(prevState => ({ ...prevState, adError: true }));
      onError?.();
    }, [onError]);

    const handleHypelabError = useCallback(() => {
      handleAdError();
    }, [handleAdError]);

    const handleHypelabAdsEnabled = useCallback(
      (enabled: boolean) => {
        if (enabled) {
          setAdsState({ currentProvider: PromotionProviderEnum.HypeLab, adError: false, adIsReady: false });
        } else {
          handleHypelabError();
        }
      },
      [handleHypelabError]
    );
    const { isHiddenTemporarily, hidePromotion } = useAdTemporaryHiding(id, currentProvider, handleHypelabAdsEnabled);

    useEffect(() => {
      if (!isFocused) {
        setAdsState({
          currentProvider: PromotionProviderEnum.HypeLab,
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
          currentProvider: PromotionProviderEnum.HypeLab,
          adError: false,
          adIsReady: false
        });
      },
      PROMO_SYNC_INTERVAL,
      [partnersPromotionEnabled, isHiddenTemporarily, shouldRefreshAd]
    );

    const handleAdReadyFactory = useCallback(
      (provider: PromotionProviderEnum) => () => {
        setAdsState(prevState => ({ ...prevState, adIsReady: true, currentProvider: provider }));
        onLoad && onLoad(provider);
      },
      [onLoad]
    );
    const handleHypelabAdReady = useMemo(
      () => handleAdReadyFactory(PromotionProviderEnum.HypeLab),
      [handleAdReadyFactory]
    );

    const handleAdImpressionFactory = useCallback(
      (provider: PromotionProviderEnum) => () => {
        onImpression?.(provider);
      },
      [onImpression]
    );
    const handleHypelabAdImpression = useMemo(
      () => handleAdImpressionFactory(PromotionProviderEnum.HypeLab),
      [handleAdImpressionFactory]
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
        {currentProvider === PromotionProviderEnum.HypeLab && isFocused && (
          <HypelabPromotion
            {...promotionCommonProps}
            onReady={handleHypelabAdReady}
            onError={handleHypelabError}
            onImpression={handleHypelabAdImpression}
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
