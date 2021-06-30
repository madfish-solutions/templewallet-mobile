import React from 'react';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { tezosDeepLinkHandler } from '../../beacon/beacon.utils';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import CustomMarker from './custom-marker.svg';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

export const ScanQrCode = () => {
  const styles = useScanQrCodeStyles();
  const { goBack } = useNavigation();

  const handleRead = ({ data }: BarCodeReadEvent) => {
    goBack();
    tezosDeepLinkHandler(data);
  };

  useNavigationSetOptions({ headerTransparent: true }, []);

  return (
    <QRCodeScanner cameraStyle={styles.camera} showMarker={true} customMarker={<CustomMarker />} onRead={handleRead} />
  );
};
