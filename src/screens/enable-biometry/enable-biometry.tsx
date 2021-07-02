import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useBiometryAvailability } from '../../hooks/use-biometry-availability.hook';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { setBiometricsEnabled } from '../../store/secure-settings/secure-settings-actions';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { showErrorToast } from '../../toast/toast.utils';
import { isDefined } from '../../utils/is-defined';
import { promptGoToSecuritySettings } from '../../utils/prompt-go-to-security-settings.util';
import { useEnableBiometryStyles } from './enable-biometry.styles';

export const EnableBiometry: FC = () => {
  const { availableBiometryType, activeBiometryType, createBiometricKeys } = useBiometryAvailability();
  const dispatch = useDispatch();
  const styles = useEnableBiometryStyles();
  const colors = useColors();
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);

  const biometryIsFace = availableBiometryType === ReactNativeBiometrics.FaceID;

  const goToWallet = () => {
    navigate(ScreensEnum.Wallet);
  };

  const onEnableBiometryClick = () => {
    if (isDefined(activeBiometryType)) {
      setLoading(true);
      createBiometricKeys()
        .then(() => {
          dispatch(setBiometricsEnabled(true));
          goToWallet();
        })
        .catch(e => showErrorToast('Error', e.message))
        .finally(() => setLoading(false));
    } else {
      promptGoToSecuritySettings();
    }
  };

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.content}>
        <Icon
          name={biometryIsFace ? IconNameEnum.FaceId : IconNameEnum.TouchId}
          size={formatSize(64)}
          color={colors.orange}
        />
        <Divider />
        <Text style={styles.title}>{biometryIsFace ? 'Face ID' : 'Touch ID'}</Text>
        <Divider size={formatSize(8)} />
        <Text style={styles.prompt}>
          Do you want to use {biometryIsFace ? 'Face ID' : 'Touch ID'} for Log In into your wallet?
        </Text>
      </View>

      <View>
        <ButtonsContainer>
          <ButtonLargeSecondary title="Skip" disabled={loading} onPress={goToWallet} />
          <Divider size={formatSize(16)} />
          <ButtonLargePrimary title="Yes" disabled={loading} onPress={onEnableBiometryClick} />
        </ButtonsContainer>

        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
