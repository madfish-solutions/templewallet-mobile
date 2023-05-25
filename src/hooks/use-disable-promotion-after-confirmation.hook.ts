import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { TextPromotionItemSelectors } from 'src/components/text-promotion-item/text-promotion-item.selectors';
import { setIsPromotionEnabledAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

export const useDisablePromotionAfterConfirmation = () => {
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  return useCallback(() => {
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
            dispatch(setIsPromotionEnabledAction(false));
          }
        }
      ]
    );
  }, [dispatch]);
};
