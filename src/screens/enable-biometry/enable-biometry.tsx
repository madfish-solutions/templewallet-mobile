import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
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
import { useShelter } from '../../shelter/use-shelter.hook';
import { setBiometricsEnabled } from '../../store/secure-settings/secure-settings-actions';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { showErrorToast } from '../../toast/toast.utils';
import { useEnableBiometryStyles } from './enable-biometry.styles';

type EnableBiometryProps = {
  seedPhrase: string;
  password: string;
};

export const EnableBiometry: FC<EnableBiometryProps> = ({ seedPhrase, password }) => {
  const { importWallet } = useShelter();
  const { activeBiometryType: availableBiometryType, setBiometricKeysExist } = useBiometryAvailability();
  const dispatch = useDispatch();
  const styles = useEnableBiometryStyles();
  const colors = useColors();
  const [loading, setLoading] = useState(false);

  const biometryIsFace =
    availableBiometryType === Keychain.BIOMETRY_TYPE.FACE || availableBiometryType === Keychain.BIOMETRY_TYPE.FACE_ID;

  const createWallet = () => {
    setLoading(true);
    importWallet(seedPhrase, password);
  };

  const onEnableBiometryClick = () => {
    ReactNativeBiometrics.createKeys()
      .then(() => {
        setBiometricKeysExist(true);
        dispatch(setBiometricsEnabled(true));
        createWallet();
      })
      .catch(e => showErrorToast('Error', e.message));
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
          <ButtonLargeSecondary title="Skip" disabled={loading} onPress={createWallet} />
          <Divider size={formatSize(16)} />
          <ButtonLargePrimary title="Yes" disabled={loading} onPress={onEnableBiometryClick} />
        </ButtonsContainer>

        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
