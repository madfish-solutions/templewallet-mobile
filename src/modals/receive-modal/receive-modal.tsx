import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { useDomainName } from 'src/hooks/use-domain-name.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { useSaplingAddressSelector } from 'src/store/sapling';
import { toggleDomainAddressShown } from 'src/store/settings/settings-actions';
import { useIsShownDomainNameSelector } from 'src/store/settings/settings-selectors';
import { useAccount } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { isString } from 'src/utils/is-string';

import { ReceiveModalSelectors } from './receive-modal.selectors';
import { useReceiveModalStyles } from './receive-modal.styles';

interface ReceivePage {
  address: string;
  symbol: string;
  name: string;
  iconName?: IconNameEnum;
  thumbnailUri?: string;
  copyTestID: ReceiveModalSelectors;
  showDomainToggle?: boolean;
  warningText?: string;
}

export const ReceiveModal = () => {
  const colors = useColors();
  const styles = useReceiveModalStyles();
  const { width: screenWidth } = useWindowDimensions();
  const selectedAccount = useAccount();
  const tezosAddress = getAccountAddressForTezos(selectedAccount);
  const evmAddress = getAccountAddressForEvm(selectedAccount);
  const { token } = useModalParams<ModalsEnum.Receive>();

  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const isShownDomainName = useIsShownDomainNameSelector();
  const domainName = useDomainName(tezosAddress ?? '');

  const saplingAddress = useSaplingAddressSelector();

  const [activePageIndex, setActivePageIndex] = useState(0);

  const pages = useMemo(() => {
    const receivePages: ReceivePage[] = [];

    if (isString(tezosAddress)) {
      receivePages.push({
        address: tezosAddress,
        symbol: token.symbol,
        name: token.name,
        iconName: token.iconName,
        thumbnailUri: token.thumbnailUri,
        copyTestID: ReceiveModalSelectors.publicAddressCopyButton,
        showDomainToggle: true
      });
    }

    if (isString(tezosAddress) && isString(saplingAddress)) {
      receivePages.push({
        address: saplingAddress,
        symbol: 'TEZ',
        name: 'Shielded',
        iconName: IconNameEnum.TezShieldedToken,
        copyTestID: ReceiveModalSelectors.copyButton,
        warningText: 'Send only TEZ tokens to this address'
      });
    }

    if (isString(evmAddress)) {
      receivePages.push({
        address: evmAddress,
        symbol: 'TEZ',
        name: 'Etherlink',
        iconName: IconNameEnum.EtherlinkToken,
        copyTestID: ReceiveModalSelectors.publicAddressCopyButton
      });
    }

    return receivePages;
  }, [evmAddress, saplingAddress, tezosAddress, token.iconName, token.name, token.symbol, token.thumbnailUri]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / screenWidth);
      setActivePageIndex(page);
    },
    [screenWidth]
  );

  useEffect(() => {
    if (activePageIndex >= pages.length) {
      setActivePageIndex(Math.max(pages.length - 1, 0));
    }
  }, [activePageIndex, pages.length]);

  const activePage = pages[activePageIndex] ?? pages[0];
  const currentAddress = activePage?.address ?? '';

  const testID = useMemo(
    () =>
      activePage?.showDomainToggle && isShownDomainName && isString(domainName)
        ? ReceiveModalSelectors.domainCopyButton
        : activePage?.copyTestID ?? ReceiveModalSelectors.publicAddressCopyButton,
    [activePage, isShownDomainName, domainName]
  );

  const handleCopyButtonPress = () => {
    copyStringToClipboard(currentAddress);
    trackEvent(testID, AnalyticsEventCategory.ButtonPress);
  };

  usePageAnalytic(ModalsEnum.Receive);

  const pageContentWidth = screenWidth - formatSize(32);

  const renderPage = (page: ReceivePage) => (
    <View style={[styles.page, { width: screenWidth }]}>
      <View style={[styles.card, { maxWidth: pageContentWidth }]}>
        <View style={styles.tokenContainer}>
          <TokenIcon size={formatSize(40)} iconName={page.iconName} thumbnailUri={page.thumbnailUri} />
          <View style={styles.tokenInfoContainer}>
            <Text style={styles.tokenSymbol}>{page.symbol}</Text>
            <Text style={styles.tokenName}>{page.name}</Text>
          </View>
        </View>
        <QRCode
          value={page.address}
          ecl="Q"
          size={formatSize(180)}
          color={colors.black}
          backgroundColor={colors.cardBG}
        />
        <Divider />

        <View style={styles.pkhWrapper}>
          <Text style={styles.addressTitle}>Address</Text>
          {page.showDomainToggle && isString(domainName) ? (
            <TouchableIcon
              size={formatSize(16)}
              style={styles.iconContainer}
              name={isShownDomainName ? IconNameEnum.Diez : IconNameEnum.Globe}
              onPress={() => dispatch(toggleDomainAddressShown())}
            />
          ) : null}
        </View>
        <Divider size={formatSize(8)} />

        <SafeTouchableOpacity style={styles.publicKeyHashContainer} onPress={handleCopyButtonPress} testID={testID}>
          {page.showDomainToggle && isShownDomainName && isString(domainName) ? (
            <Text style={styles.publicKeyHash}>{domainName}</Text>
          ) : (
            <Text style={styles.publicKeyHash}>{page.address}</Text>
          )}
        </SafeTouchableOpacity>

        {page.warningText ? (
          <>
            <Divider size={formatSize(16)} />

            <View style={styles.warningContainer}>
              <Text style={styles.warningIcon}>⚠</Text>
              <Text style={styles.warningText}>{page.warningText}</Text>
            </View>
          </>
        ) : null}
      </View>
    </View>
  );

  if (pages.length < 2) {
    return (
      <>
        <ScreenContainer contentContainerStyle={styles.rootContainer}>
          <ModalStatusBar />
          {activePage ? renderPage(activePage) : null}
        </ScreenContainer>

        <ButtonsFloatingContainer>
          <ButtonLargePrimary title="Copy" onPress={handleCopyButtonPress} />
          <InsetSubstitute type="bottom" />
        </ButtonsFloatingContainer>
      </>
    );
  }

  return (
    <>
      <ScreenContainer
        contentContainerStyle={styles.shieldedContentContainer}
        style={styles.rootContainer}
        isFullScreenMode={true}
      >
        <ModalStatusBar />

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.pagerContainer}
        >
          {pages.map(page => (
            <React.Fragment key={page.address}>{renderPage(page)}</React.Fragment>
          ))}
        </ScrollView>

        <View style={styles.dotsContainer}>
          {pages.map((page, index) => (
            <React.Fragment key={page.address}>
              {index > 0 ? <Divider size={formatSize(8)} /> : null}
              <View style={[styles.dot, activePageIndex === index ? styles.dotActive : styles.dotInactive]} />
            </React.Fragment>
          ))}
        </View>
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary title="Copy" onPress={handleCopyButtonPress} />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
