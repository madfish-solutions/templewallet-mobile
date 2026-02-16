import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch } from 'react-redux';

import { ButtonMedium } from 'src/components/button/button-medium/button-medium';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { useDomainName } from 'src/hooks/use-domain-name.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { toggleDomainAddressShown } from 'src/store/settings/settings-actions';
import { useIsShownDomainNameSelector } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isString } from 'src/utils/is-string';

import { ReceiveModalSelectors } from './receive-modal.selectors';
import { useReceiveModalStyles } from './receive-modal.styles';

export const ReceiveModal: FC = () => {
  const colors = useColors();
  const styles = useReceiveModalStyles();
  const publicKeyHash = useCurrentAccountPkhSelector();
  const { token } = useModalParams<ModalsEnum.Receive>();

  const { name, symbol } = token;

  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const isShownDomainName = useIsShownDomainNameSelector();
  const domainName = useDomainName(publicKeyHash);

  const testID = useMemo(
    () =>
      isShownDomainName && isString(domainName)
        ? ReceiveModalSelectors.domainCopyButton
        : ReceiveModalSelectors.publicAddressCopyButton,
    []
  );

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
