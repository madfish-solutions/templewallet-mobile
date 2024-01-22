import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { sendAssetActions } from 'src/store/wallet/wallet-actions';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { BURN_ADDRESS } from 'src/utils/known-addresses';

export const useBurnCollectible = (collectible: TokenMetadataInterface | nullish) => {
  const dispatch = useDispatch();

  return useMemo(() => {
    if (!collectible) {
      return;
    }

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
                amount: '1',
                receiverPublicKeyHash: BURN_ADDRESS
              })
            )
        }
      ]);
  }, [collectible, dispatch]);
};
