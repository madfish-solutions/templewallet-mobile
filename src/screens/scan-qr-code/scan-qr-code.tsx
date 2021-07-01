import React from 'react';
import { StatusBar } from 'react-native';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { tezosDeepLinkHandler } from '../../beacon/beacon.utils';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { useBarStyle } from '../../hooks/use-bar-style.hook';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useColors } from '../../styles/use-colors';
import CustomMarker from './custom-marker.svg';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

export const ScanQrCode = () => {
  const colors = useColors();
  const styles = useScanQrCodeStyles();
  const { goBack } = useNavigation();
  const { lightContent } = useBarStyle();

  const handleRead = ({ data }: BarCodeReadEvent) => {
    goBack();
    tezosDeepLinkHandler(data);
  };

  useNavigationSetOptions({ headerTransparent: true }, []);

  return (
    <>
      <StatusBar barStyle={lightContent} backgroundColor={colors.black} animated={true} />
      <QRCodeScanner
        cameraStyle={styles.camera}
        showMarker={true}
        customMarker={<CustomMarker />}
        onRead={handleRead}
      />
    </>
  );
};
