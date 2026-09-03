import { StackActions, useFocusEffect } from '@react-navigation/native';
import React, { memo, useCallback, useEffect } from 'react';
import { View } from 'react-native';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { Divider } from 'src/components/divider/divider';
import { HeaderCard } from 'src/components/header-card/header-card';
import { HeaderCardActionButtons } from 'src/components/header-card-action-buttons/header-card-action-buttons';
import { TokenEquityValue } from 'src/components/token-equity-value/token-equity-value';
import { useEtherlinkDataLoading } from 'src/hooks/evm/use-etherlink-data-loading.hook';
import { useApkBuildIdEvent } from 'src/hooks/use-apk-build-id-event';
import { usePushNotificationsEvent } from 'src/hooks/use-push-notifications-event';
import { KoloCryptoCardPreview } from 'src/modals/kolo-card';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { dispatch } from 'src/store';
import { useShouldShowNewsletterModalSelector } from 'src/store/newsletter/newsletter-selectors';
import { useHasSeenRewardsAnnouncementSelector } from 'src/store/rewards/rewards-selectors';
import { useHasSeenSaplingAnnouncementSelector } from 'src/store/sapling';
import { setKoloCardAnimationShownAction, walletOpenedAction } from 'src/store/settings/settings-actions';
import { useIsAnyBackupMadeSelector, useIsKoloCardAnimationShownSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { ContactSuggestion } from './contact-suggestion.tsx';
import { NotificationsBell } from './notifications-bell';
import { Settings } from './settings';
import { TokensList } from './token-list/token-list';
import { WalletOverlay } from './wallet-overlay';
import { WalletSelectors } from './wallet.selectors';
import { WalletStyles } from './wallet.styles';

export const Wallet = memo(() => {
  const { pageEvent } = useAnalytics();
  const navigateToModal = useNavigateToModal();
  const { dispatch: navigationDispatch, getState } = useNavigation();
  const isAnyBackupMade = useIsAnyBackupMadeSelector();
  const tezosToken = useTezosTokenOfCurrentAccount();
  const shouldShowNewsletterModal = useShouldShowNewsletterModalSelector();
  const hasSeenSaplingAnnouncement = useHasSeenSaplingAnnouncementSelector();
  const hasSeenRewardsAnnouncement = useHasSeenRewardsAnnouncementSelector();
  const isKoloCardAnimationShown = useIsKoloCardAnimationShownSelector();

  const handleKoloCardAnimationComplete = useCallback(() => {
    dispatch(setKoloCardAnimationShownAction());
  }, []);

  useApkBuildIdEvent();
  usePushNotificationsEvent();
  useEtherlinkDataLoading();

  useEffect(() => {
    if (shouldShowNewsletterModal && isAnyBackupMade) {
      const routes = getState().routes;
      const prevRouteName = routes[routes.length - 1].name;
      if (prevRouteName !== ScreensEnum.CloudBackup && prevRouteName !== ScreensEnum.ManualBackup) {
        navigationDispatch(StackActions.popToTop());
      }

      navigateToModal(ModalsEnum.Newsletter);
    }
  }, [shouldShowNewsletterModal, isAnyBackupMade]);

  useEffect(() => {
    if (!hasSeenSaplingAnnouncement) {
      navigateToModal(ModalsEnum.ShieldedAnnouncement);
    }
  }, [hasSeenSaplingAnnouncement]);

  useEffect(() => {
    if (hasSeenSaplingAnnouncement && !hasSeenRewardsAnnouncement) {
      navigateToModal(ModalsEnum.RewardsAnnouncement);
    }
  }, [hasSeenSaplingAnnouncement, hasSeenRewardsAnnouncement, navigateToModal]);

  const trackPageOpened = useCallback(() => {
    pageEvent(ScreensEnum.Wallet, '');
  }, []);

  useFocusEffect(trackPageOpened);

  useEffect(() => void dispatch(walletOpenedAction()), []);

  return (
    <>
      <HeaderCard hasInsetTop>
        <View style={WalletStyles.accountContainer}>
          <CurrentAccountDropdown testID={WalletSelectors.accountDropdownButton} />
          <View style={WalletStyles.topActionsContainer}>
            <NotificationsBell />
            <Settings />
          </View>
        </View>

        <TokenEquityValue token={tezosToken} forTotalBalance={true} />
        <Divider size={formatSize(24)} />

        <HeaderCardActionButtons token={tezosToken} />

        <View style={WalletStyles.cryptoCardContainer}>
          <KoloCryptoCardPreview
            onPress={() => navigateToModal(ModalsEnum.KoloCard)}
            shouldAnimate={!isKoloCardAnimationShown}
            onAnimationComplete={handleKoloCardAnimationComplete}
          />
        </View>
      </HeaderCard>

      <TokensList />

      <WalletOverlay />

      <ContactSuggestion />
    </>
  );
});
