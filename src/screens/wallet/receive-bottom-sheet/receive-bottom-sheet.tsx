import { useClipboard } from '@react-native-clipboard/clipboard';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ModalBottomSheet } from '../../../components/bottom-sheet/modal-bottom-sheet/modal-bottom-sheet';
import { BottomSheetControllerProps } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { useFirstAccountSelector } from '../../../store/wallet/wallet-selectors';
import { ReceiveBottomSheetStyles } from './receive-bottom-sheet.styles';
import { Button } from '../../../components/button/button';

export const ReceiveBottomSheet: FC<BottomSheetControllerProps> = ({ controller }) => {
  const [, setString] = useClipboard();
  const publicKeyHash = useFirstAccountSelector().publicKeyHash;

  const handleCopyToClipboard = () => setString(publicKeyHash);

  return (
    <ModalBottomSheet title="Receive" controller={controller}>
      <Text>Address:</Text>
      <StyledTextInput value={publicKeyHash} editable={false} />
      <Button title="Copy to clipboard" onPress={handleCopyToClipboard} />

      <View style={ReceiveBottomSheetStyles.qrCodeContainer}>
        <QRCode value={publicKeyHash} ecl="Q" />
      </View>

      <Button title="Close" onPress={controller.close} />
    </ModalBottomSheet>
  );
};
