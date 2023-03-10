import React from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { setIsPromotionEnabledAction } from 'src/store/partners-promotion/partners-promotion-actions';
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

  const handleAdsToggle = (value: boolean) => {
    if (value) {
      dispatch(setIsPromotionEnabledAction(value));
    } else {
      Alert.alert(
        'Are you sure you want to turn off all ads?',
        "We don't like ads either, but it helps our team grow and improve the user experience for our \
wallet. You can turn ads off everywhere with one click, or leave the display ads and support the development team.",
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => dispatch(setIsPromotionEnabledAction(value))
          }
        ]
      );
    }
  };

  usePageAnalytic(ScreensEnum.NotificationsSettings);

  return (
    <ScreenContainer>
      <Divider size={formatSize(8)} />
      <Label description="Configure the notifications and ads. (Platform updates and emergency notifications can’t be disabled)" />
      <Divider size={formatSize(8)} />
      <WhiteContainer>
        <WhiteContainerAction onPress={() => dispatch(setIsNewsEnabledAction(!isNewsEnabled))}>
          <WhiteContainerText text="News" />
          <Switch
            value={isNewsEnabled}
            onChange={value => dispatch(setIsNewsEnabledAction(value))}
            testID={NotificationsSettingsSelectors.newsToggle}
          />
        </WhiteContainerAction>
        <WhiteContainerAction onPress={() => dispatch(setIsNewsEnabledAction(!isNewsEnabled))}>
          <WhiteContainerText text="Ads" />
          <Switch value={isAdsEnabled} onChange={handleAdsToggle} testID={NotificationsSettingsSelectors.adsToggle} />
        </WhiteContainerAction>
      </WhiteContainer>
    </ScreenContainer>
  );
};
