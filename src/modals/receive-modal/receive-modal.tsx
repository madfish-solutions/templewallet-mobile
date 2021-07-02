import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { RouteProp, useRoute } from '@react-navigation/core';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { emptyFn } from '../../config/general';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { useReceiveModalStyles } from './receive-modal.styles';

export const ReceiveModal: FC = () => {
  const colors = useColors();
  const styles = useReceiveModalStyles();
  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;
  const { asset } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Receive>>().params;

  const { name, symbol, iconName = IconNameEnum.NoNameToken } = asset;

  const handleCopyButtonPress = () => copyStringToClipboard(publicKeyHash);

  return (
    <ScreenContainer contentContainerStyle={styles.rootContainer}>
      <ModalStatusBar />
      <View style={styles.tokenContainer}>
        <Icon name={iconName} size={formatSize(40)} />
        <Divider size={formatSize(8)} />
        <View style={styles.tokenInfoContainer}>
          <Text style={styles.tokenSymbol}>{symbol}</Text>
          <Text style={styles.tokenName}>{name}</Text>
        </View>
      </View>
      <Divider />

      <QRCode
        value={publicKeyHash}
        ecl="Q"
        size={formatSize(180)}
        color={colors.black}
        backgroundColor={colors.pageBG}
      />
      <Divider />

      <Text style={styles.addressTitle}>Address</Text>
      <Divider size={formatSize(8)} />

      <TouchableOpacity style={styles.publicKeyHashContainer} onPress={handleCopyButtonPress}>
        <Text style={styles.publicKeyHash}>{publicKeyHash}</Text>
      </TouchableOpacity>
      <Divider />

      <View style={styles.buttonsContainer}>
        <ButtonMedium title="SHARE" iconName={IconNameEnum.Share} disabled={true} onPress={emptyFn} />
        <Divider size={formatSize(8)} />
        <ButtonMedium title="COPY" iconName={IconNameEnum.Copy} onPress={handleCopyButtonPress} />
        <Divider size={formatSize(8)} />
        <ButtonMedium title="AMOUNT" iconName={IconNameEnum.Tag} disabled={true} onPress={emptyFn} />
      </View>
    </ScreenContainer>
  );
};
