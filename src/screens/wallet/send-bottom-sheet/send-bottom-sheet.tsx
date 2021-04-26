import React, { FC, useState } from 'react';
import { Button, Text, TouchableOpacity } from 'react-native';

import { BottomSheet, BottomSheetProps } from '../../../components/bottom-sheet/bottom-sheet';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { EmptyFn } from '../../../config/general';
import { AssetInterface } from '../../../interfaces/asset.interface';
import { WalletStyles } from '../wallet.styles';
import { SendBottomSheetStyles } from './send-bottom-sheet.styles';

interface Props extends BottomSheetProps {
  onClose: EmptyFn;
  assets: AssetInterface[];
}

export const SendBottomSheet: FC<Props> = ({ isOpen, onClose, onDismiss, assets }) => {
  const [amount, setAmount] = useState('0');
  const [selectedAsset] = useState(assets[0]);
  const [recipient, setRecipient] = useState('');
  return (
    <BottomSheet isOpen={isOpen} onDismiss={onDismiss}>
      <Text style={SendBottomSheetStyles.title}>Send</Text>

      {assets.map(({ token_id, name, balance }) => (
        <TouchableOpacity key={token_id} style={WalletStyles.accountItem} onPress={() => null}>
          <Text>{name}</Text>
          <Text>{balance}</Text>
        </TouchableOpacity>
      ))}

      <Text>{`Amount ${selectedAsset.name}`}</Text>
      <StyledTextInput value={amount} onChangeText={setAmount} />

      <Text>Recipient</Text>
      <StyledTextInput value={recipient} onChangeText={setRecipient} />

      <Button title="Cancel" onPress={onClose} />
      <Button title="Send" onPress={onClose} />
    </BottomSheet>
  );
};
