import React from 'react';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { beaconDeepLinkHandler } from '../../beacon/use-beacon-handler.hook';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useIsAuthorisedSelector, useSelectedAccountTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { showErrorToast } from '../../toast/toast.utils';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isBeaconPayload } from '../../utils/beacon.utils';
import { isSyncPayload } from '../../utils/sync.utils';
import { isValidAddress } from '../../utils/tezos.util';
import CustomMarker from './custom-marker.svg';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

export const ScanQrCode = () => {
  const styles = useScanQrCodeStyles();
  const { navigate, goBack } = useNavigation();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const isAuthorised = useIsAuthorisedSelector();

  usePageAnalytic(ScreensEnum.ScanQrCode);

  const handleRead = ({ data }: BarCodeReadEvent) => {
    goBack();
    if (isAuthorised) {
      if (isValidAddress(data)) {
        if (Number(tezosToken.balance) > 0) {
          navigate(ModalsEnum.Send, { token: TEZ_TOKEN_METADATA, receiverPublicKeyHash: data });
        } else {
          showErrorToast({ description: 'You need to have TEZ to pay gas fee' });
        }
      } else if (isBeaconPayload(data)) {
        beaconDeepLinkHandler(
          data,
          () =>
            navigate(ModalsEnum.Confirmation, {
              type: ConfirmationTypeEnum.DAppOperations,
              message: null,
              loading: true
            }),
          errorMessage => {
            goBack();
            showErrorToast({ description: errorMessage });
          }
        );
      } else {
        showErrorToast({ description: 'Invalid QR code' });
      }
    } else {
      if (isSyncPayload(data)) {
        navigate(ScreensEnum.ConfirmSync, { payload: data });
      } else {
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
        onRead={handleRead}
      />
    </>
  );
};
