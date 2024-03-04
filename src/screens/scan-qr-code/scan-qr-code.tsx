import React from 'react';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { beaconDeepLinkHandler } from 'src/beacon/use-beacon-handler.hook';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isBeaconPayload } from 'src/utils/beacon.utils';
import { isSyncPayload } from 'src/utils/sync.utils';
import { isValidAddress } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { ScanQrCodeAnalyticsEvents } from './analytics-events';
import CustomMarker from './custom-marker.svg';
import { EmptyQrCode } from './empty-qr-code';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

export const ScanQrCode = () => {
  const styles = useScanQrCodeStyles();
  const { navigate, goBack } = useNavigation();
  const tezosToken = useTezosTokenOfCurrentAccount();
  const isAuthorised = useIsAuthorisedSelector();
  const { trackEvent } = useAnalytics();

  const { metadata } = useNetworkInfo();

  usePageAnalytic(ScreensEnum.ScanQrCode);

  const handleRead = ({ data }: BarCodeReadEvent) => {
    goBack();
    if (isAuthorised) {
      if (isValidAddress(data)) {
        if (Number(tezosToken.balance) > 0) {
          navigate(ModalsEnum.Send, { token: metadata, receiverPublicKeyHash: data });
        } else {
          trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_ZERO_BALANCE, AnalyticsEventCategory.General);
          showErrorToast({ description: `You need to have ${metadata.symbol} to pay gas fee` });
        }
      } else if (isBeaconPayload(data)) {
        let dataWasIgnored = true;
        beaconDeepLinkHandler(
          data,
          () => {
            dataWasIgnored = false;
            navigate(ModalsEnum.Confirmation, {
              type: ConfirmationTypeEnum.DAppOperations,
              message: null,
              loading: true
            });
          },
          errorMessage => {
            dataWasIgnored = false;
            goBack();
            trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_HANDLE_ERROR, AnalyticsEventCategory.General, {
              errorMessage
            });
            showErrorToast({ description: errorMessage });
          }
        );
        if (dataWasIgnored) {
          trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_DATA_IGNORED, AnalyticsEventCategory.General, { data });
        }
      } else {
        trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_INVALID_QR_CODE, AnalyticsEventCategory.General);
        showErrorToast({ description: 'Invalid QR code' });
      }
    } else {
      if (isSyncPayload(data)) {
        navigate(ModalsEnum.ConfirmSync, { payload: data });
      } else {
        trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_INVALID_QR_CODE, AnalyticsEventCategory.General);
        showErrorToast({ description: 'Invalid QR code' });
      }
    }
  };

  useNavigationSetOptions({ headerTransparent: true }, []);

  return (
    <>
      <QRCodeScanner
        cameraStyle={styles.camera}
        showMarker={true}
        customMarker={<CustomMarker />}
        notAuthorizedView={<EmptyQrCode />}
        permissionDialogTitle="There is no access to the Camera."
        permissionDialogMessage="Please, give access in the phone Setting page."
        onRead={handleRead}
      />
    </>
  );
};
