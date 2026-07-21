import React, { FC, useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Checkbox } from 'src/components/checkbox/checkbox';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { formatSize } from 'src/styles/format-size';
import { showSuccessToast } from 'src/toast/toast.utils';

import { usePromoRewardsEnableModalStyles } from './promo-rewards-enable-modal.styles';

export const PromoRewardsEnableModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const styles = usePromoRewardsEnableModalStyles();
  const [isAgreed, setIsAgreed] = useState(false);
  const enablePromo = useCallback(() => {
    dispatch(togglePartnersPromotionAction(true));
    showSuccessToast({ description: 'Promo Rewards activated' });
    goBack();
  }, [dispatch, goBack]);

  return (
    <>
      <ScreenContainer contentContainerStyle={styles.content}>
        <ModalStatusBar />
        <Text style={styles.title}>Earn up to 20% of Promo rewards</Text>
        <Text style={styles.description}>Turn everyday wallet usage into monthly TKEY rewards.</Text>
        <View style={styles.benefit}>
          <Icon name={IconNameEnum.Success} size={formatSize(20)} />
          <Text style={styles.benefitText}>Receive your share of 20% of Promo revenue in TKEY.</Text>
        </View>
        <View style={styles.benefit}>
          <Icon name={IconNameEnum.Success} size={formatSize(20)} />
          <Text style={styles.benefitText}>Payouts are automatic at the end of each month.</Text>
        </View>
        <Checkbox value={isAgreed} onChange={setIsAgreed}>
          <Text style={styles.agreement}>
            I agree to enable Promo content. My public wallet address and IP are used to calculate and pay rewards. You
            can opt out anytime in Settings.
          </Text>
        </Checkbox>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonLargePrimary title="Start Earning" disabled={!isAgreed} onPress={enablePromo} />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
