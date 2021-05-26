import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { useScreenHeader } from '../../components/header/use-screen-header.hook';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormCheckbox } from '../../form/form-checkbox';
import { FormMnemonicInput } from '../../form/form-mnemonic-input';
import { FormPasswordInput } from '../../form/form-password-input';
import { useShelter } from '../../shelter/use-shelter.hook';
import { formatSize } from '../../styles/format-size';
import {
  ImportAccountFormValues,
  importAccountInitialValues,
  importAccountValidationSchema
} from './import-account.form';
import { ImportAccountStyles } from './import-account.styles';

export const ImportAccount = () => {
  const { importWallet } = useShelter();

  useScreenHeader('Import existing Wallet');

  const onSubmit = ({ seedPhrase, password }: ImportAccountFormValues) => importWallet(seedPhrase, password);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <Formik
        initialValues={importAccountInitialValues}
        validationSchema={importAccountValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm, isValid }) => (
          <>
            <View>
              <Label label="Seed phrase" description="Mnemonic. Your secret 12 or more words." />
              <FormMnemonicInput name="seedPhrase" isInputMode />

              <Label label="Password" description="A password is used to protect the wallet." />
              <FormPasswordInput name="password" />

              <Label label="Repeat Password" description="Please enter the password again." />
              <FormPasswordInput name="passwordConfirmation" />
            </View>

            <View>
              <View style={ImportAccountStyles.checkboxContainer}>
                <FormCheckbox name="acceptTerms" />
                <Label label="Accept terms" />
              </View>
              <Label
                description="I have read and agree to
the Terms of Usage and Privacy Policy"
              />

              <ButtonLargePrimary title="Import" disabled={!isValid} marginTop={formatSize(24)} onPress={submitForm} />
              <InsetSubstitute type="bottom" />
            </View>
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
