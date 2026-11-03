import React from 'react';
import Dialog from 'react-native-dialog';

import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { Switch } from 'src/components/switch/switch';
import { WhiteContainer } from 'src/components/white-container/white-container';
import { WhiteContainerAction } from 'src/components/white-container/white-container-action/white-container-action';
import { WhiteContainerText } from 'src/components/white-container/white-container-text/white-container-text';
import { usePromotionAfterConfirmation } from 'src/hooks/use-disable-promotion-after-confirmation.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { dispatch } from 'src/store';
import { setIsNewsEnabledAction } from 'src/store/notifications/notifications-actions';
import { useIsNewsEnabledSelector } from 'src/store/notifications/notifications-selectors';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { AdvancedFeaturesSettingsSelectors } from './advanced-features-settings.selectors';

export const AdvancedFeaturesSettings = () => {
  const isNewsEnabled = useIsNewsEnabledSelector();
  const isAdsEnabled = useIsPartnersPromoEnabledSelector();

  const { enablePromotion, disablePromotion, dialogProps } = usePromotionAfterConfirmation();
  const { title, description, buttons, ...containerProps } = dialogProps;

  const handleAdsToggle = (value: boolean) => {
    if (value) {
      enablePromotion();
    } else {
      disablePromotion();
    }
  };

  usePageAnalytic(ScreensEnum.AdvancedFeaturesSettings);

  return (
    <ScreenContainer>
      <Divider size={formatSize(8)} />
      <Label description="Configure the notifications and promo. (Platform updates and emergency notifications can’t be disabled)" />
      <Divider size={formatSize(8)} />
      <WhiteContainer>
        <WhiteContainerAction
          onPress={() => dispatch(setIsNewsEnabledAction(!isNewsEnabled))}
          testID={AdvancedFeaturesSettingsSelectors.newsAction}
          testIDProperties={{ newValue: !isNewsEnabled }}
        >
          <WhiteContainerText text="News" />
          <Switch
            value={isNewsEnabled}
            onChange={value => dispatch(setIsNewsEnabledAction(value))}
            testID={AdvancedFeaturesSettingsSelectors.newsToggle}
            testIDProperties={{ newValue: !isNewsEnabled }}
          />
        </WhiteContainerAction>
        <WhiteContainerAction
          onPress={() => handleAdsToggle(!isAdsEnabled)}
          testID={AdvancedFeaturesSettingsSelectors.promoAction}
          testIDProperties={{ newValue: !isAdsEnabled }}
        >
          <WhiteContainerText text="Promo" />
          <Switch
            value={isAdsEnabled}
            onChange={() => handleAdsToggle(!isAdsEnabled)}
            testID={AdvancedFeaturesSettingsSelectors.promoToggle}
            testIDProperties={{ newValue: !isAdsEnabled }}
          />
        </WhiteContainerAction>
      </WhiteContainer>

      <Dialog.Container {...containerProps}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        {buttons.map((buttonProps, index) => (
          <Dialog.Button key={index} {...buttonProps} />
        ))}
      </Dialog.Container>
    </ScreenContainer>
  );
};
