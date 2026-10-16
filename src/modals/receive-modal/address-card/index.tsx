import { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';

import { QrBottomSheet } from '../qr-bottom-sheet';
import { ReceiveModalSelectors } from '../receive-modal.selectors';
import { AddressCardProps } from '../types';

import { useAddressCardStyles } from './styles';

export const AddressCard = ({ title, address, cryptoLogoName, showWarningOnCard, warningText }: AddressCardProps) => {
  const bottomSheetController = useBottomSheetController();
  const colors = useColors();
  const { trackEvent } = useAnalytics();
  const styles = useAddressCardStyles();

  const handleCopyClick = useCallback(() => {
    copyStringToClipboard(address);
    trackEvent(ReceiveModalSelectors.publicAddressCopyButton, AnalyticsEventCategory.ButtonPress, { type: title });
  }, [address, trackEvent, title]);

  const handleQrButtonClick = useCallback(() => {
    trackEvent(ReceiveModalSelectors.qrCodeButton, AnalyticsEventCategory.ButtonPress, { type: title });
    bottomSheetController.open();
  }, [bottomSheetController, trackEvent, title]);

  return (
    <>
      <View style={styles.root}>
        <View style={styles.header}>
          <NetworkIcon name={cryptoLogoName} variant="large" />

          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.addressRow}>
          <Text style={styles.address}>{address}</Text>

          <TouchableOpacity onPress={handleCopyClick} style={styles.actionButton}>
            <IconV2 name={IconNameV2Enum.Copy} color={colors.blue} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleQrButtonClick} style={styles.actionButton}>
            <IconV2 name={IconNameV2Enum.Qr} color={colors.blue} />
          </TouchableOpacity>
        </View>

        {showWarningOnCard && (
          <View style={styles.warningContainer}>
            <IconV2 name={IconNameV2Enum.AlarmTriangle} />
            <Text style={styles.warningText}>{warningText}</Text>
          </View>
        )}
      </View>

      <QrBottomSheet
        title={title}
        address={address}
        cryptoLogoName={cryptoLogoName}
        warningText={warningText}
        controller={bottomSheetController}
      />
    </>
  );
};
