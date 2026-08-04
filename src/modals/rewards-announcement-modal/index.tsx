import { useIsFocused } from '@react-navigation/native';
import React, { FC, useCallback, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import tkeyCoinAnimation from 'src/assets/animations/tkey-coin-animation.json';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { LottieAnimation } from 'src/components/lottie-animation';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation, useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { setHasSeenRewardsAnnouncementAction } from 'src/store/rewards/rewards-actions';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { useRewardsAnnouncementModalStyles } from './styles';

export const RewardsAnnouncementModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const navigateToScreen = useNavigateToScreen();
  const { trackEvent } = useAnalytics();
  const isFocused = useIsFocused();
  const styles = useRewardsAnnouncementModalStyles();

  useEffect(() => {
    if (!isFocused) return;
    dispatch(setHasSeenRewardsAnnouncementAction());
    void trackEvent('AdsEnabled', AnalyticsEventCategory.General);
  }, [dispatch, isFocused, trackEvent]);

  const managePromo = useCallback(
    () => navigateToScreen({ screen: ScreensEnum.AdvancedFeaturesSettings }),
    [navigateToScreen]
  );

  return (
    <>
      <ScreenContainer contentContainerStyle={styles.content}>
        <ModalStatusBar />
        <LottieAnimation source={tkeyCoinAnimation} resizeMode="cover" style={styles.animation} />
        <View style={styles.info}>
          <Text style={styles.title}>TKEY rewards for all</Text>
          <Text style={styles.description}>
            We turned wallet usage into earning with Promo rewards and it’s now active in your wallet.{' '}
            <Text style={styles.emphasizedDescription}>20% revenue goes to you,</Text> no extra steps.
          </Text>
        </View>
        <View style={styles.benefits}>
          <View style={styles.benefit}>
            <Icon name={IconNameEnum.DollarFiled} />
            <Text style={styles.benefitText}>Auto-payouts in TKEY every month.</Text>
          </View>
          <Divider size={formatSize(8)} />
          <View style={styles.benefit}>
            <Icon name={IconNameEnum.SoundOff} />
            <Text style={styles.benefitText}>Ad content runs quietly without interruption.</Text>
          </View>
        </View>
        <Disclaimer
          iconName={IconNameEnum.Info}
          texts={[
            'Your IP helps us surface the best content and commission rate for your region and public wallet address collected for automatic reward payouts. You can turn this off anytime in Settings.'
          ]}
        />
        <TouchableOpacity style={styles.managePromo} onPress={managePromo}>
          <Icon name={IconNameEnum.Settings} size={formatSize(14)} />
          <Text style={styles.managePromoText}>Manage Promo</Text>
        </TouchableOpacity>
      </ScreenContainer>
      <ButtonsFloatingContainer style={styles.buttonsContainer}>
        <ButtonLargePrimary title="Got it" onPress={goBack} />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
