import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { PromotionItemSelectors } from 'src/components/image-promotion-view/selectors';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

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
            }
          }
        ]
      ),
    [dispatch]
  );

  const disablePromotion = useCallback(
    () =>
      Alert.alert(
        'Are you sure you want to disable all ads?',
        'Pay attention: you can receive rewards in TKEY tokens for viewing ads in our wallet. If you disabled Ads, you can always activate it in the settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => trackEvent(PromotionItemSelectors.cancelButton, AnalyticsEventCategory.ButtonPress)
          },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => {
              trackEvent(PromotionItemSelectors.disableButton, AnalyticsEventCategory.ButtonPress);
              dispatch(togglePartnersPromotionAction(false));
            }
          }
        ]
      ),
    [dispatch, trackEvent]
  );

  return { enablePromotion, disablePromotion };
};
