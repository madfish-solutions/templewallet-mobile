import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Camera,
  CameraPosition,
  Code,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner
} from 'react-native-vision-camera';

import { beaconDeepLinkHandler } from 'src/beacon/use-beacon-handler.hook';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useSuggestedHeaderHeight } from 'src/hooks/use-suggested-header-height.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isBeaconPayload } from 'src/utils/beacon.utils';
import { isString } from 'src/utils/is-string';
import { isSyncPayload } from 'src/utils/sync.utils';
import { isValidAddress } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { ScanQrCodeAnalyticsEvents } from './analytics-events';
import CustomMarker from './custom-marker.svg';
import { EmptyQrCode } from './empty-qr-code';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

const positionsPriority: CameraPosition[] = ['back', 'external', 'front'];

export const ScanQrCode = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionWasRequested, setPermissionWasRequested] = useState(false);
  const styles = useScanQrCodeStyles();
  const { bottom: marginBottom } = useSafeAreaInsets();

  useEffect(() => {
    if (permissionWasRequested || hasPermission) {
      return;
    }

    requestPermission().finally(() => setPermissionWasRequested(true));
  }, [permissionWasRequested, hasPermission, requestPermission]);

  return (
    <View style={[styles.container, { marginBottom }]}>
      {hasPermission ? <CameraView /> : permissionWasRequested && <EmptyQrCode />}
    </View>
  );
};

const CameraView = () => {
  const styles = useScanQrCodeStyles();
  const navigateToModal = useNavigateToModal();
  const { goBack } = useNavigation();
  const tezosToken = useTezosTokenOfCurrentAccount();
  const isAuthorised = useIsAuthorisedSelector();
  const { trackEvent } = useAnalytics();
  const { top: topInset } = useSafeAreaInsets();

  const { metadata } = useNetworkInfo();

  usePageAnalytic(ScreensEnum.ScanQrCode);

  const handleRead = useCallback(
    (codes: Code[]) => {
      goBack();
      const data = codes.filter(
        (code): code is Code & { value: string } => code.type === 'qr' && isString(code.value)
      )[0]?.value;

      if (!data) {
        return;
      }

      if (isAuthorised) {
        if (isValidAddress(data)) {
          if (Number(tezosToken.balance) > 0) {
            navigateToModal(ModalsEnum.Send, { token: metadata, receiverPublicKeyHash: data });
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
              navigateToModal(ModalsEnum.Confirmation, {
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
          navigateToModal(ModalsEnum.ConfirmSync, { payload: data });
        } else {
          trackEvent(ScanQrCodeAnalyticsEvents.SCAN_QR_CODE_INVALID_QR_CODE, AnalyticsEventCategory.General);
          showErrorToast({ description: 'Invalid QR code' });
        }
      }
    },
    [goBack, navigateToModal, trackEvent, tezosToken, metadata, isAuthorised]
  );

  const headerHeight = useSuggestedHeaderHeight(false);
  useNavigationSetOptions(
    {
      headerTransparent: true,
      headerStyle: { height: headerHeight - topInset, shadowOpacity: 0 }
    },
    [headerHeight]
  );

  const cameraDevices = useCameraDevices();
  const cameraDevice = useMemo(
    () =>
      Array.from(cameraDevices).sort(
        (a, b) => positionsPriority.indexOf(a.position) - positionsPriority.indexOf(b.position)
      )[0],
    [cameraDevices]
  );
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: handleRead
  });

  return (
    <>
      <Camera style={styles.camera} codeScanner={codeScanner} device={cameraDevice} isActive />
      <View style={[styles.markerContainer, { top: topInset }]}>
        <CustomMarker width={formatSize(223)} height={formatSize(223)} />
      </View>
    </>
  );
};
