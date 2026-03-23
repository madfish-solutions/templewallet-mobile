import React, { useCallback, useMemo, useState } from 'react';
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
import { useSaplingAddressSelector, useIsSaplingCredentialsLoadedSelector } from 'src/store/sapling';
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

export const ReceiveModal = () => {
  const colors = useColors();
  const styles = useReceiveModalStyles();
  const { width: screenWidth } = useWindowDimensions();
  const publicKeyHash = useCurrentAccountPkhSelector();
  const { token } = useModalParams<ModalsEnum.Receive>();

  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const isShownDomainName = useIsShownDomainNameSelector();
  const domainName = useDomainName(publicKeyHash);

  const saplingAddress = useSaplingAddressSelector();
  const isCredentialsLoaded = useIsSaplingCredentialsLoadedSelector();
  const showShieldedPage = isCredentialsLoaded && isString(saplingAddress);

  const [activePageIndex, setActivePageIndex] = useState(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / screenWidth);
      setActivePageIndex(page);
    },
    [screenWidth]
  );

  const currentAddress = activePageIndex === 0 ? publicKeyHash : saplingAddress ?? '';

  const testID = useMemo(
    () =>
      isShownDomainName && isString(domainName) && activePageIndex === 0
        ? ReceiveModalSelectors.domainCopyButton
        : ReceiveModalSelectors.publicAddressCopyButton,
    [activePageIndex, isShownDomainName, domainName]
  );

  const handleCopyButtonPress = () => {
    copyStringToClipboard(currentAddress);
    trackEvent(testID, AnalyticsEventCategory.ButtonPress);
  };

  usePageAnalytic(ModalsEnum.Receive);

  const pageContentWidth = screenWidth - formatSize(32);

  const renderPublicPage = () => (
    <View style={[styles.page, { width: screenWidth }]}>
      <View style={[styles.card, { maxWidth: pageContentWidth }]}>
        <View style={styles.tokenContainer}>
          <TokenIcon size={formatSize(40)} iconName={token.iconName} thumbnailUri={token.thumbnailUri} />
          <View style={styles.tokenInfoContainer}>
            <Text style={styles.tokenSymbol}>{token.symbol}</Text>
            <Text style={styles.tokenName}>{token.name}</Text>
          </View>
        </View>
        <QRCode
          value={publicKeyHash}
          ecl="Q"
          size={formatSize(180)}
          color={colors.black}
          backgroundColor={colors.cardBG}
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

        <SafeTouchableOpacity style={styles.publicKeyHashContainer} onPress={handleCopyButtonPress} testID={testID}>
          {isShownDomainName && isString(domainName) ? (
            <Text style={styles.publicKeyHash}>{domainName}</Text>
          ) : (
            <Text style={styles.publicKeyHash}>{publicKeyHash}</Text>
          )}
        </SafeTouchableOpacity>
      </View>
    </View>
  );

  const renderShieldedPage = () => (
    <View style={[styles.page, { width: screenWidth }]}>
      <View style={[styles.card, { maxWidth: pageContentWidth }]}>
        <View style={styles.tokenContainer}>
          <TokenIcon size={formatSize(40)} iconName={IconNameEnum.TezShieldedToken} />
          <View style={styles.tokenInfoContainer}>
            <Text style={styles.tokenSymbol}>TEZ</Text>
            <Text style={styles.tokenName}>Shielded</Text>
          </View>
        </View>
        <QRCode
          value={saplingAddress ?? ''}
          ecl="Q"
          size={formatSize(180)}
          color={colors.black}
          backgroundColor={colors.cardBG}
        />
        <Divider />

        <Text style={styles.addressTitle}>Address</Text>
        <Divider size={formatSize(8)} />

        <SafeTouchableOpacity
          style={styles.publicKeyHashContainer}
          onPress={handleCopyButtonPress}
          testID={ReceiveModalSelectors.copyButton}
        >
          <Text style={styles.publicKeyHash}>{saplingAddress}</Text>
        </SafeTouchableOpacity>
        <Divider size={formatSize(16)} />

        <View style={styles.warningContainer}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningText}>Send only TEZ tokens to this address</Text>
        </View>
      </View>
    </View>
  );

  if (!showShieldedPage) {
    return (
      <>
        <ScreenContainer contentContainerStyle={styles.rootContainer}>
          <ModalStatusBar />
          {renderPublicPage()}
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
          {renderPublicPage()}
          {renderShieldedPage()}
        </ScrollView>

        <View style={styles.dotsContainer}>
          <View style={[styles.dot, activePageIndex === 0 ? styles.dotActive : styles.dotInactive]} />
          <Divider size={formatSize(8)} />
          <View style={[styles.dot, activePageIndex === 1 ? styles.dotActive : styles.dotInactive]} />
        </View>
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary title="Copy" onPress={handleCopyButtonPress} />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
