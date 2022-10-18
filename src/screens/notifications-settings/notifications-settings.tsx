import React from 'react';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { Switch } from '../../components/switch/switch';
import { WhiteContainer } from '../../components/white-container/white-container';
import { WhiteContainerAction } from '../../components/white-container/white-container-action/white-container-action';
import { WhiteContainerText } from '../../components/white-container/white-container-text/white-container-text';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { newsEnabledToggleAction } from '../../store/news/news-actions';
import { useNewsEnabledSelector } from '../../store/news/news-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { NotificationsSettingsSelectors } from './notifications-settings.selectors';

export const NotificationsSettings = () => {
  const dispatch = useDispatch();

  const newsEnabled = useNewsEnabledSelector();

  usePageAnalytic(ScreensEnum.NotificationsSettings);

  // const handleNewsToggle = (newValue: boolean) => {
  //   if (isDefined(biometryType)) {
  //     newValue ? navigate(ModalsEnum.EnableBiometryPassword) : dispatch(disableBiometryPassword());
  //   } else {
  //     openSecuritySettings();
  //   }
  // };

  return (
    <ScreenContainer>
      <Label description="Configure the notifications you want to receive. (Platform updates and emergency notifications can’t be disabled)" />
      <Divider size={formatSize(8)} />
      <WhiteContainer>
        <WhiteContainerAction onPress={() => dispatch(newsEnabledToggleAction(!newsEnabled))}>
          <WhiteContainerText text="News" />
          <Switch
            value={newsEnabled}
            onChange={value => dispatch(newsEnabledToggleAction(value))}
            testID={NotificationsSettingsSelectors.NewsSwitch}
          />
        </WhiteContainerAction>
      </WhiteContainer>
    </ScreenContainer>
  );
};
