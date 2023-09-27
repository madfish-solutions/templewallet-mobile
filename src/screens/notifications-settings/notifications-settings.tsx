import React from 'react';
import { useDispatch } from 'react-redux';

import { usePromotionAfterConfirmation } from 'src/hooks/use-disable-promotion-after-confirmation.hook';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';

import { Divider } from '../../components/divider/divider';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { Switch } from '../../components/switch/switch';
import { WhiteContainer } from '../../components/white-container/white-container';
import { WhiteContainerAction } from '../../components/white-container/white-container-action/white-container-action';
import { WhiteContainerText } from '../../components/white-container/white-container-text/white-container-text';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { setIsNewsEnabledAction } from '../../store/notifications/notifications-actions';
import { useIsNewsEnabledSelector } from '../../store/notifications/notifications-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
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
