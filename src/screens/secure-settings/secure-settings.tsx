import React from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { Switch } from '../../components/switch/switch';
import { WhiteContainer } from '../../components/white-container/white-container';
import { WhiteContainerAction } from '../../components/white-container/white-container-action/white-container-action';
import { WhiteContainerText } from '../../components/white-container/white-container-text/white-container-text';
import { useBiometryAvailability } from '../../hooks/use-biometry-availability.hook';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { setBiometricsEnabled } from '../../store/settings/settings-actions';
import { useBiometricsEnabledSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { promptGoToSecuritySettings } from '../../utils/prompt-go-to-security-settings.util';

export const SecureSettings = () => {
  const biometricsEnabled = useBiometricsEnabledSelector();
  const { activeBiometryType, availableBiometryType } = useBiometryAvailability();
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const biometryIsTouch = isDefined(activeBiometryType)
    ? activeBiometryType === Keychain.BIOMETRY_TYPE.TOUCH_ID ||
      activeBiometryType === Keychain.BIOMETRY_TYPE.FINGERPRINT
    : availableBiometryType !== ReactNativeBiometrics.FaceID;

  const handleBiometrySwitch = (newValue: boolean) => {
    if (newValue && !isDefined(activeBiometryType) && isDefined(availableBiometryType)) {
      promptGoToSecuritySettings();
    } else if (newValue) {
      navigate(ModalsEnum.ApprovePassword, { shouldEnableBiometry: true });
    } else {
      dispatch(setBiometricsEnabled(false));
    }
  };

  return (
    <ScreenContainer>
      <Divider size={formatSize(8)} />
      {isDefined(availableBiometryType) && (
        <WhiteContainer>
          <WhiteContainerAction disabled={true}>
            <WhiteContainerText text={biometryIsTouch ? 'Touch ID' : 'Face ID'} />
            <Switch value={biometricsEnabled} onChange={handleBiometrySwitch} />
          </WhiteContainerAction>
        </WhiteContainer>
      )}
    </ScreenContainer>
  );
};
