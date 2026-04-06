import React from 'react';
import { useDispatch } from 'react-redux';

import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { isAndroid, isIOS } from 'src/config/system';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { catchThrowToastError } from 'src/toast/toast.utils';
import { cloudTitle, FAILED_TO_LOGIN_ERR_TITLE, fetchCloudBackup, requestSignInToCloud } from 'src/utils/cloud-backup';
import { useIsCloudAvailable } from 'src/utils/cloud-backup/use-is-available';

import { WelcomeSelectors } from './welcome.selectors';
import { useCloudButtonActiveColorStyleConfig } from './welcome.styles';

export const ContinueWithCloudButton = () => {
  const cloudBtnActiveColorStyleConfig = useCloudButtonActiveColorStyleConfig();
  const dispatch = useDispatch();

  const theme = useThemeSelector();

  const navigateToScreen = useNavigateToScreen();

  const cloudIsAvailable = useIsCloudAvailable();

  const iconName = getCloudIconEnum(theme, cloudIsAvailable !== false);

  const handlePress = useCallbackIfOnline(async () => {
    try {
      dispatch(showLoaderAction());

      const isLoggedIn = await requestSignInToCloud().catch(catchThrowToastError(FAILED_TO_LOGIN_ERR_TITLE, true));

      if (!isLoggedIn) {
        dispatch(hideLoaderAction());

        return;
      }

      const backup = await fetchCloudBackup().catch(catchThrowToastError('Failed to read from cloud', true));

      dispatch(hideLoaderAction());
      navigateToScreen({ screen: ScreensEnum.ContinueWithCloud, params: { backup } });
    } catch (error) {
      dispatch(hideLoaderAction());
      navigateToScreen({ screen: ScreensEnum.ContinueWithCloud, params: { error } });
    }
  });

  return (
    <ButtonLargeSecondary
      title={`Continue with ${cloudTitle}`}
      iconName={iconName}
      activeColorStyleConfig={cloudBtnActiveColorStyleConfig[isAndroid ? 'googleDrive' : 'iCloud']}
      disabled={cloudIsAvailable === false}
      onPress={handlePress}
      testID={WelcomeSelectors.continueWithCloudButton}
      testIDProperties={{ cloud: cloudTitle }}
    />
  );
};

const getCloudIconEnum = (theme: ThemesEnum, cloudIsAvailable: boolean) => {
  if (isIOS) {
    if (theme === ThemesEnum.light) {
      return cloudIsAvailable ? IconNameEnum.CloudFill : IconNameEnum.CloudFillOnDark;
    }

    return cloudIsAvailable ? IconNameEnum.CloudFillOnDark : IconNameEnum.CloudFill;
  }

  return IconNameEnum.GoogleDrive;
};
