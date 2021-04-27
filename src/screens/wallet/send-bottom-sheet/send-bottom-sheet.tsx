import React, { FC, useState } from 'react';
import { Button, Text, TouchableOpacity } from 'react-native';

import { BottomSheet, BottomSheetProps } from '../../../components/bottom-sheet/bottom-sheet';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { EmptyFn } from '../../../config/general';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { WalletStyles } from '../wallet.styles';
import { SendBottomSheetStyles } from './send-bottom-sheet.styles';

interface Props extends BottomSheetProps {
  from: string;
  onClose: EmptyFn;
  balance?: string;
}

export const SendBottomSheet: FC<Props> = ({ from, isOpen, onClose, onDismiss, balance }) => {
  // TODO: replace with NumberInput
  const [amount, setAmount] = useState('0');
  const [recipient, setRecipient] = useState('tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne');
  const { send } = useShelter();

  return (
    <BottomSheet isOpen={isOpen} onDismiss={onDismiss}>
      <Text style={SendBottomSheetStyles.title}>Send</Text>

      <TouchableOpacity style={WalletStyles.accountItem} onPress={() => null}>
        <Text>Tezos</Text>
        <Text>{balance}</Text>
      </TouchableOpacity>

      <Text>Amount Tezos</Text>
      <StyledTextInput value={amount} onChangeText={setAmount} />

      <Text>Recipient</Text>
      <StyledTextInput value={recipient} onChangeText={setRecipient} />

      <Button title="Cancel" onPress={onClose} />
      <Button title="Send" onPress={() => send(from, amount, recipient)} />
    </BottomSheet>
  );
};
