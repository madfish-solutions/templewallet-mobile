import { FC } from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { BottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { NetworkIcon } from '../network-icon';
import { AddressCardProps } from '../types';

import { useQrBottomSheetStyles } from './styles';

interface QrBottomSheetProps extends Omit<AddressCardProps, 'showWarningOnCard'> {
  controller: BottomSheetController;
}

export const QrBottomSheet: FC<QrBottomSheetProps> = ({ controller, title, address, cryptoLogoName, warningText }) => {
  const colors = useColors();
  const styles = useQrBottomSheetStyles();

  return (
    <BottomSheet
      controller={controller}
      showCancelButton={false}
      contentHeight={formatSize(390)}
      rootStyle={styles.root}
      showCloseButton
      description={title}
    >
      <View style={styles.contentContainer}>
        <View style={styles.qrCodeRow}>
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={address}
              ecl="Q"
              size={formatSize(180)}
              color={colors.black}
              backgroundColor={colors.white}
            />
          </View>
        </View>

        <NetworkIcon iconName={cryptoLogoName} />

        <Text style={styles.text}>{warningText}</Text>
      </View>
    </BottomSheet>
  );
};
