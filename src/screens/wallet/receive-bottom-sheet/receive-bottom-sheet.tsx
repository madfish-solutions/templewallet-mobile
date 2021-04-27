import { useClipboard } from '@react-native-clipboard/clipboard';
import React, { FC } from 'react';
import { Button, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { BottomSheetStateProps } from '../../../components/bottom-sheet/bottom-sheet-state.props';
import { ModalBottomSheet } from '../../../components/bottom-sheet/modal-bottom-sheet/modal-bottom-sheet';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { useFirstAccountSelector } from '../../../store/wallet/wallet-selectors';
import { ReceiveBottomSheetStyles } from './receive-bottom-sheet.styles';

export const ReceiveBottomSheet: FC<BottomSheetStateProps> = ({ isOpen, onClose }) => {
  const [, setString] = useClipboard();
  const publicKeyHash = useFirstAccountSelector().publicKeyHash;

  const handleCopyToClipboard = () => setString(publicKeyHash);

  return (
    <ModalBottomSheet title="Receive" isOpen={isOpen} onClose={onClose}>
      <Text>Address:</Text>
      <StyledTextInput value={publicKeyHash} editable={false} />
      <Button title="Copy to clipboard" onPress={handleCopyToClipboard} />

      <View style={ReceiveBottomSheetStyles.qrCodeContainer}>
        <QRCode value={publicKeyHash} ecl="Q" />
      </View>

      <Button title="Close" onPress={onClose} />
    </ModalBottomSheet>
  );
};
