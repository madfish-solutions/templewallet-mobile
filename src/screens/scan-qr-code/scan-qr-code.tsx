import React from 'react';
import { StatusBar } from 'react-native';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { tezosDeepLinkHandler } from '../../beacon/beacon.utils';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { useBarStyle } from '../../hooks/use-bar-style.hook';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useTezosTokenSelector } from '../../store/wallet/wallet-selectors';
import { useColors } from '../../styles/use-colors';
import { showErrorToast } from '../../toast/toast.utils';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { isValidAddress } from '../../utils/tezos.util';
import CustomMarker from './custom-marker.svg';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

export const ScanQrCode = () => {
  const colors = useColors();
  const styles = useScanQrCodeStyles();
  const { goBack, navigate } = useNavigation();
  const { lightContent } = useBarStyle();
  const tezosToken = useTezosTokenSelector();

  const handleRead = ({ data }: BarCodeReadEvent) => {
    goBack();
    if (isValidAddress(data) && Number(tezosToken.balance) > 0) {
      navigate(ModalsEnum.Send, { asset: TEZ_TOKEN_METADATA, receiverPublicKeyHash: data });
    } else if (isValidAddress(data)) {
      showErrorToast({ description: "Can't send TEZ: the balance is zero" });
    } else {
      tezosDeepLinkHandler(data);
    }
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
