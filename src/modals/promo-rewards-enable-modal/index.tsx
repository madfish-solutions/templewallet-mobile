import React, { FC, useCallback } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import tkeyCoinAnimation from 'src/assets/animations/tkey-coin-animation.json';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { LottieAnimation } from 'src/components/lottie-animation';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { formatSize } from 'src/styles/format-size';
import { showSuccessToast } from 'src/toast/toast.utils';

import { usePromoRewardsEnableModalStyles } from './styles';

const benefits = [
  { iconName: IconNameEnum.Megaphone, text: 'Non-intrusive promo content' },
  { iconName: IconNameEnum.Calendar, text: 'Auto-payouts every month without claim' },
  { iconName: IconNameEnum.Uptrend, text: 'Boost with Temple Wallet extension' },
  { iconName: IconNameEnum.Gears, text: 'Turn feature on when it works for you' }
];

export const PromoRewardsEnableModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const styles = usePromoRewardsEnableModalStyles();
  const isPromoEnabled = useIsPartnersPromoEnabledSelector();

  const enablePromo = useCallback(() => {
    dispatch(togglePartnersPromotionAction(true));
    showSuccessToast({ description: 'Promo rewards activated' });
    goBack();
  }, [dispatch, goBack]);

  return (
    <>
      <ScreenContainer contentContainerStyle={styles.content}>
        <ModalStatusBar />
        <LottieAnimation source={tkeyCoinAnimation} resizeMode="cover" style={styles.animation} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Receive share of{`\n`}20% promo rewards</Text>
        </View>
        <View style={styles.benefits}>
          {benefits.map(({ iconName, text }) => (
            <View key={text} style={styles.benefit}>
              <Icon name={iconName} size={formatSize(24)} />
              <Text style={styles.benefitText}>{text}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.agreement}>
          By enabling Promo, you agree to share your wallet address and IP to receive tokens and view ads.
        </Text>
      </ScreenContainer>
      <ButtonsFloatingContainer style={styles.buttonsContainer}>
        <ButtonLargePrimary title="Start Earning" disabled={isPromoEnabled} onPress={enablePromo} />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
