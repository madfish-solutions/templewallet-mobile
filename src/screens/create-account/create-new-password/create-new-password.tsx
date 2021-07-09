import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from '../../../components/checkbox-description/checkbox-label';
import { Divider } from '../../../components/divider/divider';
import { HeaderButton } from '../../../components/header/header-button/header-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { TextLink } from '../../../components/text-link/text-link';
import { privacyPolicy, termsOfUse } from '../../../config/socials';
import { FormCheckbox } from '../../../form/form-checkbox';
import { FormPasswordInput } from '../../../form/form-password-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { formatSize } from '../../../styles/format-size';
import {
  createNewPasswordInitialValues,
  createNewPasswordValidationSchema,
  CreateNewPasswordFormValues
} from './create-new-password.form';
import { useCreateNewPasswordStyles } from './create-new-password.styles';
import ReactNativeBiometrics from 'react-native-biometrics';
import { noop } from 'lodash';
import Keychain from 'react-native-keychain';
import { APP_IDENTIFIER, Shelter } from '../../../shelter/shelter';

type CreateNewPasswordProps = {
  onGoBackPress: () => void;
  seedPhrase: string;
};

console.log('keeek');

ReactNativeBiometrics.isSensorAvailable()
  .then((result) => console.log(result))
  .catch(noop);
Keychain.getSupportedBiometryType()
  .then(biometryType => console.log('keychain', biometryType))
  .catch(noop);

export const CreateNewPassword: FC<CreateNewPasswordProps> = ({ onGoBackPress, seedPhrase }) => {
  const styles = useCreateNewPasswordStyles();
  const { importWallet } = useShelter();

  const handleSubmit = ({ password }: CreateNewPasswordFormValues) => {
    importWallet(seedPhrase, password);
  };

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={onGoBackPress} />,
      headerTitle: () => <HeaderTitle title="Create a new password" />
    },
    [onGoBackPress]
  );

  const createSignature = () => {
    ReactNativeBiometrics.createSignature({
      promptMessage: 'Sign in',
      payload: 'message_payload'
    })
      .then(result => {
        console.log('signed', result);
      })
      .catch(e => {
        console.log('signing error', e);
      });
  };

  const createKeys = () => {
    ReactNativeBiometrics.createKeys()
      .then(result => {
        console.log('keys created', result);
      })
      .catch(e => {
        console.log('creating keys error', e);
      });
  };
  const key = 'testKey';
  const value = 'password';

  const savePass = () => {
    Keychain.getSupportedBiometryType()
      .then(result => {
        console.log('getSupportedBiometryType', result);
      })
      .catch(e => {
        console.log('getSupportedBiometryType error', e);
      });

    Keychain.setGenericPassword(key, JSON.stringify(value), {
      service: `${APP_IDENTIFIER}/${key}`,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS
    })
      .then(result => {
        console.log('setGenericPassword', result);
      })
      .catch(e => {
        console.log('setGenericPassword error', e);
      });
  };

  const getPass = () => {
    Keychain.getGenericPassword({
      service: `${APP_IDENTIFIER}/${key}`,
      // accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      // authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS
    })
      .then(result => {
        console.log('getGenericPassword', result);
      })
      .catch(e => {
        console.log('getGenericPassword error', e);
      });
  };

  return (
    <Formik
      initialValues={createNewPasswordInitialValues}
      validationSchema={createNewPasswordValidationSchema}
      onSubmit={handleSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Divider size={formatSize(12)} />
            <Label label="Password" description="A password is used to protect the wallet." />
            <FormPasswordInput name="password" />

            <Label label="Repeat Password" description="Please enter the password again." />
            <FormPasswordInput name="passwordConfirmation" />

            <ButtonLargePrimary title="Create keys" onPress={createKeys} />
            <ButtonLargePrimary title="Sign" onPress={createSignature} />
            <ButtonLargePrimary title="Save pass" onPress={savePass} />
            <ButtonLargePrimary title="get pass" onPress={getPass} />
          </View>
          <Divider />

          <View>
            <View style={styles.checkboxContainer}>
              <FormCheckbox name="acceptTerms">
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Accept terms</Text>
              </FormCheckbox>
            </View>
            <CheckboxLabel>
              I have read and agree to{'\n'}the <TextLink url={termsOfUse}>Terms of Usage</TextLink> and{' '}
              <TextLink url={privacyPolicy}>Privacy Policy</TextLink>
            </CheckboxLabel>

            <Divider />
            <ButtonLargePrimary title="Create" disabled={!isValid} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
