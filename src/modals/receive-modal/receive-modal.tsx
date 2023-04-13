import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { RouteProp, useRoute } from '@react-navigation/core';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch } from 'react-redux';

import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TokenIcon } from '../../components/token-icon/token-icon';
import { useDomainName } from '../../hooks/use-domain-name.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { toggleDomainAddressShown } from '../../store/settings/settings-actions';
import { useIsShownDomainNameSelector } from '../../store/settings/settings-selectors';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { useAnalytics, usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { isString } from '../../utils/is-string';
import { ReceiveModalSelectors } from './receive-modal.selectors';
import { useReceiveModalStyles } from './receive-modal.styles';

export const ReceiveModal: FC = () => {
  const colors = useColors();
  const styles = useReceiveModalStyles();
  const publicKeyHash = useSelectedAccountSelector().publicKeyHash;
  const { token } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Receive>>().params;

  const { name, symbol } = token;
  const testID = useMemo(
    () =>
      isShownDomainName && isString(domainName)
        ? ReceiveModalSelectors.domainCopyButton
        : ReceiveModalSelectors.publicAddressCopyButton,
    []
  );

  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const isShownDomainName = useIsShownDomainNameSelector();
  const domainName = useDomainName(publicKeyHash);

  const handleCopyButtonPress = () => {
    copyStringToClipboard(publicKeyHash);
    trackEvent(testID, AnalyticsEventCategory.ButtonPress);
  };

  usePageAnalytic(ModalsEnum.Receive);

  return (
    <ScreenContainer contentContainerStyle={styles.rootContainer}>
      <ModalStatusBar />
      <Divider size={formatSize(16)} />
      <View style={styles.tokenContainer}>
        <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} />
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

      <View style={styles.pkhWrapper}>
        <Text style={styles.addressTitle}>Address</Text>
        {isString(domainName) ? (
          <TouchableIcon
            size={formatSize(16)}
            style={styles.iconContainer}
            name={isShownDomainName ? IconNameEnum.Diez : IconNameEnum.Globe}
            onPress={() => dispatch(toggleDomainAddressShown())}
          />
        ) : null}
      </View>
      <Divider size={formatSize(8)} />

      <TouchableOpacity style={styles.publicKeyHashContainer} onPress={handleCopyButtonPress} testID={testID}>
        {isShownDomainName && isString(domainName) ? (
          <Text style={styles.publicKeyHash}>{domainName}</Text>
        ) : (
          <Text style={styles.publicKeyHash}>{publicKeyHash}</Text>
        )}
      </TouchableOpacity>
      <Divider />

      <View style={styles.buttonsContainer}>
        <ButtonMedium title="COPY" iconName={IconNameEnum.Copy} onPress={handleCopyButtonPress} />
      </View>
    </ScreenContainer>
  );
};
