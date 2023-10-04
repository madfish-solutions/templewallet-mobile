import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { sendAssetActions } from 'src/store/wallet/wallet-actions';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export const BURN_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX';

export const useBurnCollectible = (collectible: TokenInterface) => {
  const dispatch = useDispatch();

  return useCallback(() => {
    Alert.alert('Are you sure you want to Burn this NFT?', 'It will be irretrievably lost.', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Let it burn!',
        style: 'destructive',
        onPress: () =>
          dispatch(
            sendAssetActions.submit({
              asset: collectible,
              amount: 1,
              receiverPublicKeyHash: BURN_ADDRESS
            })
          )
      }
    ]);
  }, [collectible, dispatch]);
};
