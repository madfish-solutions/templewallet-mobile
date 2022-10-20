import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, View } from 'react-native';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { beaconDeepLinkHandler } from '../../beacon/use-beacon-handler.hook';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { isAndroid } from '../../config/system';
import { useNetworkInfo } from '../../hooks/use-network-info.hook';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useIsAuthorisedSelector, useSelectedAccountTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { showErrorToast } from '../../toast/toast.utils';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isBeaconPayload } from '../../utils/beacon.utils';
import { isSyncPayload } from '../../utils/sync.utils';
import { isValidAddress } from '../../utils/tezos.util';
import CustomMarker from './custom-marker.svg';
import { EmptyQrCode } from './empty-qr-code';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

export const ScanQrCode = () => {
  const styles = useScanQrCodeStyles();
  const { navigate, goBack } = useNavigation();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const isAuthorised = useIsAuthorisedSelector();
  const [isAndroidCameraPermissionGranted, setIsAndroidCameraPermissionGranted] = useState(true);

  const { metadata } = useNetworkInfo();

  usePageAnalytic(ScreensEnum.ScanQrCode);

  const handleRead = ({ data }: BarCodeReadEvent) => {
    goBack();
    if (isAuthorised) {
      if (isValidAddress(data)) {
        if (Number(tezosToken.balance) > 0) {
          navigate(ModalsEnum.Send, { token: metadata, receiverPublicKeyHash: data });
        } else {
          showErrorToast({ description: `You need to have ${metadata.symbol} to pay gas fee` });
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

  useEffect(() => {
    if (isAndroid) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then(granted =>
        setIsAndroidCameraPermissionGranted(granted)
      );
    }
  }, []);

  useNavigationSetOptions({ headerTransparent: true }, []);

  return (
    <>
      <QRCodeScanner
        cameraStyle={styles.camera}
        showMarker={true}
        customMarker={<CustomMarker />}
        notAuthorizedView={<EmptyQrCode />}
        onRead={handleRead}
      />
      {isAndroidCameraPermissionGranted === false && (
        <View style={styles.emptyScreenAndroid}>
          <EmptyQrCode />
        </View>
      )}
    </>
  );
};
