import React from 'react';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { Switch } from 'src/components/switch/switch';
import { WhiteContainer } from 'src/components/white-container/white-container';
import { WhiteContainerAction } from 'src/components/white-container/white-container-action/white-container-action';
import { WhiteContainerText } from 'src/components/white-container/white-container-text/white-container-text';
import { usePromotionAfterConfirmation } from 'src/hooks/use-disable-promotion-after-confirmation.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { setIsNewsEnabledAction } from 'src/store/notifications/notifications-actions';
import { useIsNewsEnabledSelector } from 'src/store/notifications/notifications-selectors';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { NotificationsSettingsSelectors } from './notifications-settings.selectors';

export const NotificationsSettings = () => {
  const dispatch = useDispatch();

  const isNewsEnabled = useIsNewsEnabledSelector();
  const isAdsEnabled = useIsPartnersPromoEnabledSelector();

  const { enablePromotion, disablePromotion } = usePromotionAfterConfirmation();

  const handleAdsToggle = (value: boolean) => {
    if (value) {
      enablePromotion();
    } else {
      disablePromotion();
    }
  };

  usePageAnalytic(ScreensEnum.NotificationsSettings);

  return (
    <ScreenContainer>
      <Divider size={formatSize(8)} />
      <Label description="Configure the notifications and ads. (Platform updates and emergency notifications can’t be disabled)" />
      <Divider size={formatSize(8)} />
      <WhiteContainer>
        <WhiteContainerAction
          onPress={() => dispatch(setIsNewsEnabledAction(!isNewsEnabled))}
          testID={NotificationsSettingsSelectors.newsAction}
          testIDProperties={{ newValue: !isNewsEnabled }}
        >
          <WhiteContainerText text="News" />
          <Switch
            value={isNewsEnabled}
            onChange={value => dispatch(setIsNewsEnabledAction(value))}
            testID={NotificationsSettingsSelectors.newsToggle}
            testIDProperties={{ newValue: !isNewsEnabled }}
          />
        </WhiteContainerAction>
        <WhiteContainerAction
          onPress={() => handleAdsToggle(!isAdsEnabled)}
          testID={NotificationsSettingsSelectors.adsAction}
          testIDProperties={{ newValue: !isAdsEnabled }}
        >
          <WhiteContainerText text="Ads" />
          <Switch
            value={isAdsEnabled}
            onChange={() => handleAdsToggle(!isAdsEnabled)}
            testID={NotificationsSettingsSelectors.adsToggle}
            testIDProperties={{ newValue: !isAdsEnabled }}
          />
        </WhiteContainerAction>
      </WhiteContainer>
    </ScreenContainer>
  );
};
