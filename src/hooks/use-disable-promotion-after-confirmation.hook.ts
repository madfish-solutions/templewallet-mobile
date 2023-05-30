import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { setIsPromotionEnabledAction } from 'src/store/partners-promotion/partners-promotion-actions';

export const usePromotionAfterConfirmation = () => {
  const dispatch = useDispatch();

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
            onPress: () => dispatch(setIsPromotionEnabledAction(true))
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
            style: 'cancel'
          },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => dispatch(setIsPromotionEnabledAction(false))
          }
        ]
      ),
    [dispatch]
  );

  return { enablePromotion, disablePromotion };
};
