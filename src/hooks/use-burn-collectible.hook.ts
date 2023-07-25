import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { sendAssetActions } from '../store/wallet/wallet-actions';
import { CollectibleInterface } from '../token/interfaces/collectible-interfaces.interface';
import { isDefined } from '../utils/is-defined';

export const BURN_ADDRESS = 'tz1burnburnburnburnburnburnburjAYjjX';

export const useBurnCollectible = (collectible: CollectibleInterface) => {
  const dispatch = useDispatch();

  return () => {
    if (isDefined(collectible)) {
      return Alert.alert('Are you sure you want to Burn this NFT?', 'It will be irretrievably lost.', [
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
    }
  };
};
