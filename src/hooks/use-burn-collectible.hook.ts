import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { sendAssetActions } from '../store/wallet/wallet-actions';
import { TokenInterface } from '../token/interfaces/token.interface';

export const BURN_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX';

export const useBurnCollectible = (collectible: TokenInterface) => {
  const dispatch = useDispatch();

  return () =>
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
};
