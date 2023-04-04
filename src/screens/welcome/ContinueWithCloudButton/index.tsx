import React from 'react';

import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { isAndroid } from 'src/config/system';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { cloudTitle } from 'src/utils/cloud-backup';
import { useIsCloudAvailable } from 'src/utils/cloud-backup/use-is-available';

import { WelcomeSelectors } from '../welcome.selectors';
import { useCloudButtonActiveColorStyleConfig } from '../welcome.styles';
import { useOnContinueWithCloudButtonPress } from './utils';

export const ContinueWithCloudButton = () => {
  const cloudBtnActiveColorStyleConfig = useCloudButtonActiveColorStyleConfig();

  const theme = useThemeSelector();

  const onPress = useOnContinueWithCloudButtonPress();

  const cloudIsAvailable = useIsCloudAvailable();

  const iconName = isAndroid
    ? IconNameEnum.GoogleDrive
    : theme === ThemesEnum.light || !cloudIsAvailable
    ? IconNameEnum.Apple
    : IconNameEnum.AppleOnDark;

  return (
    <ButtonLargeSecondary
      title={`Continue with ${cloudTitle}`}
      iconName={iconName}
      activeColorStyleConfig={cloudBtnActiveColorStyleConfig[isAndroid ? 'googleDrive' : 'iCloud']}
      disabled={!cloudIsAvailable}
      onPress={onPress}
      testID={WelcomeSelectors.continueWithCloudButton}
      testIDProperties={{ cloud: cloudTitle }}
    />
  );
};
