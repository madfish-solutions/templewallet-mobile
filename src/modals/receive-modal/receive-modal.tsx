import Clipboard from '@react-native-clipboard/clipboard';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { emptyFn } from '../../config/general';
import { step } from '../../config/styles';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { useReceiveModalStyles } from './receive-modal.styles';

export const ReceiveModal: FC = () => {
  const colors = useColors();
  const styles = useReceiveModalStyles();
  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;

  return (
    <ScreenContainer contentContainerStyle={styles.rootContainer}>
      <View style={styles.tokenContainer}>
        <Icon name={IconNameEnum.XtzToken} size={5 * step} />
        <View style={styles.tokenInfoContainer}>
          <Text style={styles.tokenSymbol}>XTZ</Text>
          <Text style={styles.tokenName}>Tezos</Text>
        </View>
      </View>

      <QRCode
        value={publicKeyHash}
        ecl="Q"
        size={formatSize(180)}
        color={colors.black}
        backgroundColor={colors.pageBG}
      />

      <Text style={styles.addressTitle}>Address</Text>
      <Text style={styles.publicKeyHash}>{publicKeyHash}</Text>

      <View style={styles.buttonsContainer}>
        <ButtonMedium
          title="SHARE"
          iconName={IconNameEnum.Share}
          disabled={true}
          onPress={emptyFn}
        />
        <Divider size={formatSize(8)} />
        <ButtonMedium
          title="COPY"
          iconName={IconNameEnum.Copy}
          onPress={() => Clipboard.setString(publicKeyHash)}
        />
        <Divider size={formatSize(8)} />
        <ButtonMedium title="AMOUNT" iconName={IconNameEnum.Tag} disabled={true} onPress={emptyFn} />
      </View>
    </ScreenContainer>
  );
};
