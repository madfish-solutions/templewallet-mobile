import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Camera,
  CameraPosition,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner
} from 'react-native-vision-camera';

import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { isIOS } from 'src/config/system';
import { useSuggestedHeaderHeight } from 'src/hooks/use-suggested-header-height.hook';
import { formatSize } from 'src/styles/format-size';
import { isString } from 'src/utils/is-string';

import CustomMarker from './custom-marker.svg';
import { EmptyQrCode } from './empty-qr-code';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

const positionsPriority: CameraPosition[] = ['back', 'external', 'front'];

interface Props {
  onQrCodeRead: (data: string) => void;
}

export const QrCodeScanner = ({ onQrCodeRead }: Props) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionWasRequested, setPermissionWasRequested] = useState(false);
  const styles = useScanQrCodeStyles();
  const { bottom: marginBottom } = useSafeAreaInsets();

  useEffect(() => {
    if (permissionWasRequested || hasPermission) {
      return;
    }

    requestPermission().finally(() => setPermissionWasRequested(true));
  }, [hasPermission, permissionWasRequested, requestPermission]);

  return (
    <View style={[styles.container, { marginBottom }]}>
      {hasPermission ? <CameraView onQrCodeRead={onQrCodeRead} /> : permissionWasRequested && <EmptyQrCode />}
    </View>
  );
};

const CameraView = ({ onQrCodeRead }: Props) => {
  const styles = useScanQrCodeStyles();
  const { top: topInset } = useSafeAreaInsets();
  const headerHeight = useSuggestedHeaderHeight(false);

  useNavigationSetOptions(
    {
      headerTransparent: true,
      headerStyle: isIOS ? { height: headerHeight } : { height: headerHeight - topInset, shadowOpacity: 0 }
    },
    [headerHeight, topInset]
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
    onCodeScanned: codes => {
      const data = codes.find(
        (code): code is typeof code & { value: string } => code.type === 'qr' && isString(code.value)
      )?.value;

      if (data) {
        onQrCodeRead(data);
      }
    }
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
