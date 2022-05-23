import { useNavigationState } from '@react-navigation/native';
import React from 'react';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { beaconDeepLinkHandler } from '../../beacon/use-beacon-handler.hook';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { showErrorToast } from '../../toast/toast.utils';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isSyncPayload } from '../../utils/sync.utils';
import { isValidAddress } from '../../utils/tezos.util';
import CustomMarker from './custom-marker.svg';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

export const ScanQrCode = () => {
  const styles = useScanQrCodeStyles();
  const prevRoute = useNavigationState(state => state.routes[state.routes.length - 1].name);
  const { goBack, navigate } = useNavigation();
  const tezosToken = useTezosTokenSelector();

  usePageAnalytic(ScreensEnum.ScanQrCode);

  const handleRead = ({ data }: BarCodeReadEvent) => {
    goBack();
    if (isValidAddress(data) && Number(tezosToken.balance) > 0) {
      navigate(ModalsEnum.Send, { token: TEZ_TOKEN_METADATA, receiverPublicKeyHash: data });
    } else if (isValidAddress(data)) {
      showErrorToast({ description: 'You need to have TEZ to pay gas fee' });
    } else if (isSyncPayload(data)) {
      navigate(ScreensEnum.ConfirmSync, { payload: data });
    } else {
      if (prevRoute === ScreensEnum.ScanQrCode) {
        showErrorToast({ description: 'Invalid QR code' });
      } else {
        beaconDeepLinkHandler(data);
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
