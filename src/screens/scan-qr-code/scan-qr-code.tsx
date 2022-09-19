import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useCameraDevices, Camera } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';

import { beaconDeepLinkHandler } from '../../beacon/use-beacon-handler.hook';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { useNetworkInfo } from '../../hooks/use-network-info.hook';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useIsAuthorisedSelector, useSelectedAccountTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { showErrorToast } from '../../toast/toast.utils';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isBeaconPayload } from '../../utils/beacon.utils';
import { isDefined } from '../../utils/is-defined';
import { isSyncPayload } from '../../utils/sync.utils';
import { isValidAddress } from '../../utils/tezos.util';
import CustomMarker from './custom-marker.svg';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

export const ScanQrCode = () => {
  const styles = useScanQrCodeStyles();
  const { navigate, goBack } = useNavigation();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const isAuthorised = useIsAuthorisedSelector();

  const { metadata } = useNetworkInfo();

  const [hasPermission, setHasPermission] = useState(false);

  const devices = useCameraDevices();
  const device = devices.back;
  const isCameraAvailable = device != null && hasPermission;

  const [frameProcessor, qrCodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true
  });

  usePageAnalytic(ScreensEnum.ScanQrCode);
  useNavigationSetOptions({ headerTransparent: true }, []);

  useEffect(() => void Camera.requestCameraPermission().then(status => setHasPermission(status === 'authorized')), []);

  useEffect(() => {
    const data = qrCodes[0]?.displayValue;

    if (hasPermission && isDefined(data)) {
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
    }
  }, [qrCodes.length]);

  return isCameraAvailable ? (
    <View>
      <Camera style={styles.camera} device={device} isActive frameProcessor={frameProcessor} frameProcessorFps={5} />
      <CustomMarker />
    </View>
  ) : null;
};
