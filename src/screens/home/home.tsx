import React, { useCallback, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BottomSheet } from '../../components/bottom-sheet/bottom-sheet';
import { useBottomSheet } from '../../components/bottom-sheet/use-bottom-sheet.hook';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { loadAssetsActions } from '../../store/assets/assets-actions';
import { useAssetsSelector } from '../../store/assets/assets-selectors';
import { useFirstAccountSelector } from '../../store/wallet/wallet-selectors';
import { HomeStyles } from './home.styles';

export const Home = () => {
  const firstAccount = useFirstAccountSelector();
  const assets = useAssetsSelector();

  const dispatch = useDispatch();
  const { isOpen, open, onDismiss } = useBottomSheet();

  const getAcc = useCallback(() => {
    dispatch(loadAssetsActions.submit(firstAccount.publicKeyHash));
  }, []);

  useEffect(() => void dispatch(loadAssetsActions.submit(firstAccount.publicKeyHash)), []);

  return (
    <>
      <ScreenContainer hasBackButton={false}>
        <Button onPress={getAcc} title={'send'} />
        <TouchableOpacity style={HomeStyles.accountInfo} onPress={() => null}>
          <Text style={HomeStyles.accountName}>{firstAccount.name}</Text>
          <Text style={HomeStyles.accountKey}>{firstAccount.publicKeyHash}</Text>
        </TouchableOpacity>
        <Text style={HomeStyles.amount}>1 000.00 XTZ</Text>
        <Text style={HomeStyles.formatted}>= 88 000.00 $</Text>
        <View style={HomeStyles.buttonRow}>
          <TouchableOpacity onPress={open}>
            <Text style={HomeStyles.button}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => null}>
            <Text style={HomeStyles.button}>Send</Text>
          </TouchableOpacity>
        </View>
        {assets.map(({ token_id, name, balance }) => (
          <TouchableOpacity key={token_id} style={HomeStyles.accountItem} onPress={() => null}>
            <Text>{name}</Text>
            <Text>{balance}</Text>
          </TouchableOpacity>
        ))}
      </ScreenContainer>

      <BottomSheet isOpen={isOpen} onDismiss={onDismiss}>
        <Text>Awesome 🎉</Text>
      </BottomSheet>
    </>
  );
};
