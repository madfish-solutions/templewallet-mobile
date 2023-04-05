import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { setIsPromotionEnabledAction } from 'src/store/partners-promotion/partners-promotion-actions';

export const useDisablePromotionAfterConfirmation = () => {
  const dispatch = useDispatch();

  return useCallback(() => {
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
    );
  }, [dispatch]);
};
