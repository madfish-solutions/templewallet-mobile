import React from 'react';
import { useDispatch } from 'react-redux';

import { openSecuritySettings } from 'src/biometry/biometry.utils';
import { useBiometryAvailability } from 'src/biometry/use-biometry-availability.hook';
import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { Switch } from 'src/components/switch/switch';
import { WhiteContainer } from 'src/components/white-container/white-container';
import { WhiteContainerAction } from 'src/components/white-container/white-container-action/white-container-action';
import { WhiteContainerText } from 'src/components/white-container/white-container-text/white-container-text';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import {
  disableBiometryPassword,
  setIsAnalyticsEnabled,
  setIsBalanceHidden
} from 'src/store/settings/settings-actions';
import {
  useAnalyticsEnabledSelector,
  useBalanceHiddenSelector,
  useBiometricsEnabledSelector
} from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { SecureSettingsSelectors } from './secure-settings.selectors';

export const SecureSettings = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { isHardwareAvailable, biometryType } = useBiometryAvailability();

  const analyticsEnabled = useAnalyticsEnabledSelector();
  const biometricsEnabled = useBiometricsEnabledSelector();
  const isBalanceHiddenSetting = useBalanceHiddenSelector();

  const isBiometryAvailable = isDefined(biometryType) && biometricsEnabled;

  usePageAnalytic(ScreensEnum.SecureSettings);

  const handleBiometrySwitch = (newValue: boolean) => {
    if (isDefined(biometryType)) {
      newValue ? navigate(ModalsEnum.EnableBiometryPassword) : dispatch(disableBiometryPassword());
    } else {
      openSecuritySettings();
    }
  };

  return (
    <ScreenContainer>
      <Divider size={formatSize(8)} />
      <WhiteContainer>
        <WhiteContainerAction
          onPress={() => dispatch(setIsAnalyticsEnabled(!analyticsEnabled))}
          testID={SecureSettingsSelectors.analyticsAction}
          testIDProperties={{ newValue: !analyticsEnabled }}
        >
          <WhiteContainerText text="Analytics" />
          <Switch
            value={analyticsEnabled}
            onChange={value => dispatch(setIsAnalyticsEnabled(value))}
            testID={SecureSettingsSelectors.analyticsToggle}
          />
        </WhiteContainerAction>
      </WhiteContainer>
      {isHardwareAvailable && (
        <>
          <Divider size={formatSize(8)} />
          <WhiteContainer>
            <WhiteContainerAction
              onPress={() => handleBiometrySwitch(!isBiometryAvailable)}
              testID={SecureSettingsSelectors.biometricsAction}
              testIDProperties={{ newValue: !isBiometryAvailable }}
            >
              <WhiteContainerText text={biometryType ?? 'Biometrics'} />
              <Switch
                value={isBiometryAvailable}
                onChange={handleBiometrySwitch}
                testID={SecureSettingsSelectors.biometricsToggle}
              />
            </WhiteContainerAction>
          </WhiteContainer>
        </>
      )}
      <Divider size={formatSize(8)} />
      <WhiteContainer>
        <WhiteContainerAction
          onPress={() => dispatch(setIsBalanceHidden(!isBalanceHiddenSetting))}
          testID={SecureSettingsSelectors.hideModeOnLaunchAction}
          testIDProperties={{ newValue: !isBalanceHiddenSetting }}
        >
          <WhiteContainerText text="Hide mode on Launch" />
          <Switch
            value={isBalanceHiddenSetting}
            onChange={value => dispatch(setIsBalanceHidden(value))}
            testID={SecureSettingsSelectors.hideModeOnLaunchToggle}
          />
        </WhiteContainerAction>
      </WhiteContainer>
    </ScreenContainer>
  );
};
