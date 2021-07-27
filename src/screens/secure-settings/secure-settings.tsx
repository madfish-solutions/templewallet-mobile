import React from 'react';
import { useDispatch } from 'react-redux';

import { openSecuritySettings } from '../../biometry/biometry.utils';
import { useBiometryAvailability } from '../../biometry/use-biometry-availability.hook';
import { Divider } from '../../components/divider/divider';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { Switch } from '../../components/switch/switch';
import { WhiteContainer } from '../../components/white-container/white-container';
import { WhiteContainerAction } from '../../components/white-container/white-container-action/white-container-action';
import { WhiteContainerText } from '../../components/white-container/white-container-text/white-container-text';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { disableBiometryPassword, setIsBalanceHidden } from '../../store/settings/settings-actions';
import { useBalanceHiddenSelector, useBiometricsEnabledSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';

export const SecureSettings = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { biometryType } = useBiometryAvailability();

  const biometricsEnabled = useBiometricsEnabledSelector();
  const isBalanceHiddenState = useBalanceHiddenSelector();

  const isBiometryAvailable = isDefined(biometryType) && biometricsEnabled;

  const handleBiometrySwitch = (newValue: boolean) => {
    if (isDefined(biometryType)) {
      newValue ? navigate(ModalsEnum.EnableBiometryPassword) : dispatch(disableBiometryPassword());
    } else {
      openSecuritySettings();
    }
  };

  const hideBalanceHandler = (newValue: boolean) => {
    dispatch(setIsBalanceHidden(newValue));
  };

  return (
    <ScreenContainer>
      <Divider size={formatSize(8)} />
      <WhiteContainer>
        <WhiteContainerAction onPress={() => handleBiometrySwitch(!isBiometryAvailable)}>
          <WhiteContainerText text={biometryType ?? 'Biometrics'} />
          <Switch value={isBiometryAvailable} onChange={handleBiometrySwitch} />
        </WhiteContainerAction>
      </WhiteContainer>
      <Divider size={formatSize(8)} />
      <WhiteContainer>
        <WhiteContainerAction onPress={() => hideBalanceHandler(!isBalanceHiddenState)}>
          <WhiteContainerText text={'Hide mode on Launch'} />
          <Switch value={isBalanceHiddenState} onChange={hideBalanceHandler} />
        </WhiteContainerAction>
      </WhiteContainer>
    </ScreenContainer>
  );
};
