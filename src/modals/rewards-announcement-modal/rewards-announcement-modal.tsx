import { useIsFocused } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import {
  setAdsEnabledEventSentAction,
  setHasSeenRewardsAnnouncementAction
} from 'src/store/partners-promotion/partners-promotion-actions';
import { useIsAdsEnabledEventSentSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { useRewardsAnnouncementModalStyles } from './rewards-announcement-modal.styles';

export const RewardsAnnouncementModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { trackEvent } = useAnalytics();
  const isFocused = useIsFocused();
  const eventWasSent = useIsAdsEnabledEventSentSelector();
  const styles = useRewardsAnnouncementModalStyles();

  useEffect(() => {
    if (!isFocused) return;
    dispatch(setHasSeenRewardsAnnouncementAction());
    if (!eventWasSent) {
      void trackEvent('AdsEnabled', AnalyticsEventCategory.General, {}, true);
      dispatch(setAdsEnabledEventSentAction());
    }
  }, [dispatch, eventWasSent, isFocused, trackEvent]);

  return (
    <>
      <ScreenContainer scrollEnabled={false} contentContainerStyle={styles.content}>
        <ModalStatusBar />
        <Icon name={IconNameEnum.Deal} size={formatSize(64)} style={styles.icon} />
        <Text style={styles.title}>TKEY rewards for all</Text>
        <Text style={styles.description}>
          We turned wallet usage into earning with Promo rewards and it’s now active in your wallet. 20% of revenue goes
          to you, no extra steps.
        </Text>
        <View style={styles.benefits}>
          <View style={styles.benefit}>
            <Icon name={IconNameEnum.Success} size={formatSize(20)} />
            <Text style={styles.benefitText}>Auto-payouts in TKEY every month.</Text>
          </View>
          <Divider size={formatSize(8)} />
          <View style={styles.benefit}>
            <Icon name={IconNameEnum.Deal} size={formatSize(20)} />
            <Text style={styles.benefitText}>Promo content runs quietly without interruption.</Text>
          </View>
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonLargePrimary title="Got it" onPress={goBack} />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
