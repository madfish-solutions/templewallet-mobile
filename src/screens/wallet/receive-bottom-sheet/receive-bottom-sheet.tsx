import { useClipboard } from '@react-native-clipboard/clipboard';
import React, { FC } from 'react';
import { Button, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { BottomSheet, BottomSheetProps } from '../../../components/bottom-sheet/bottom-sheet';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { EmptyFn } from '../../../config/general';
import { useFirstAccountSelector } from '../../../store/wallet/wallet-selectors';
import { ReceiveBottomSheetStyles } from './receive-bottom-sheet.styles';

interface Props extends BottomSheetProps {
  onClose: EmptyFn;
}

export const ReceiveBottomSheet: FC<Props> = ({ isOpen, onClose, onDismiss }) => {
  const [, setString] = useClipboard();
  const publicKeyHash = useFirstAccountSelector().publicKeyHash;

  const handleCopyToClipboard = () => setString(publicKeyHash);

  return (
    <BottomSheet isOpen={isOpen} onDismiss={onDismiss}>
      <Text style={ReceiveBottomSheetStyles.title}>Receive</Text>

      <Text>Address:</Text>
      <StyledTextInput value={publicKeyHash} editable={false} />
      <Button title="Copy to clipboard" onPress={handleCopyToClipboard} />

      <View style={ReceiveBottomSheetStyles.qrCodeContainer}>
        <QRCode value={publicKeyHash} ecl="Q" />
      </View>

      <Button title="Close" onPress={onClose} />
    </BottomSheet>
  );
};
