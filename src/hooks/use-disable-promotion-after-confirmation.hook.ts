import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { TextPromotionItemSelectors } from 'src/components/text-promotion-item/text-promotion-item.selectors';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { setAdsBannerVisibilityAction } from '../store/settings/settings-actions';

export const usePromotionAfterConfirmation = () => {
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  const enablePromotion = useCallback(
    () =>
      Alert.alert(
        'Support the development team and earn tokens by viewing ads inside the wallet.',
        'To enable this feature, we request your permission to trace your Wallet Address and IP address. You can always disable ads in the settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Enable',
            style: 'destructive',
            onPress: () => {
              dispatch(togglePartnersPromotionAction(true));
              dispatch(setAdsBannerVisibilityAction(false));
            }
          }
        ]
      ),
    [dispatch]
  );

  const disablePromotion = useCallback(
    () =>
      Alert.alert(
        'Are you sure you want to turn off all ads?',
        'Pay attention: you can receive cashback in USDt tokens for enabling advertisement in our \
wallet. If you turned off ADS, you can always activate it in the settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => trackEvent(TextPromotionItemSelectors.cancelButton, AnalyticsEventCategory.ButtonPress)
          },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => {
              trackEvent(TextPromotionItemSelectors.disablelButton, AnalyticsEventCategory.ButtonPress);
              dispatch(togglePartnersPromotionAction(false));
              dispatch(setAdsBannerVisibilityAction(false));
            }
          }
        ]
      ),
    [dispatch]
  );

  return { enablePromotion, disablePromotion };
};
