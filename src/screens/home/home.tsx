import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { loadAssetsActions } from '../../store/assets/assets-actions';
import { useAssetsSelector } from '../../store/assets/assets-selectors';
import { useFirstAccountSelector } from '../../store/wallet/wallet-selectors';
import { HomeStyles } from './home.styles';

export const Home = () => {
  const firstAccount = useFirstAccountSelector();
  const assets = useAssetsSelector();

  const dispatch = useDispatch();

  useEffect(() => void dispatch(loadAssetsActions.submit(firstAccount.publicKeyHash)), []);

  return (
    <ScreenContainer hasBackButton={false}>
      <TouchableOpacity style={HomeStyles.accountInfo} onPress={() => null}>
        <Text style={HomeStyles.accountName}>{firstAccount.name}</Text>
        <Text style={HomeStyles.accountKey}>{firstAccount.publicKeyHash}</Text>
      </TouchableOpacity>
      <Text style={HomeStyles.amount}>1 000.00 XTZ</Text>
      <Text style={HomeStyles.formatted}>= 88 000.00 $</Text>
      <View style={HomeStyles.buttonRow}>
        <TouchableOpacity onPress={() => null}>
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
  );
};
