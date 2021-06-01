import { Formik } from 'formik';
import React from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormCheckbox } from '../../form/form-checkbox';
import { FormMnemonicCreate } from '../../form/form-mnemonic-create';
import { FormPasswordInput } from '../../form/form-password-input';
import { useShelter } from '../../shelter/use-shelter.hook';
import { formatSize } from '../../styles/format-size';
import {
  CreateAccountFormValues,
  createAccountInitialValues,
  createAccountValidationSchema
} from './create-account.form';
import { useCreateAccountStyles } from './create-account.styles';

export const CreateAccount = () => {
  const { importWallet } = useShelter();
  const styles = useCreateAccountStyles();

  const onSubmit = (data: CreateAccountFormValues) => importWallet(data.seedPhrase, data.password);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <Formik
        initialValues={createAccountInitialValues}
        validationSchema={createAccountValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm, isValid }) => (
          <>
            <View>
              <Label
                label="Seed phrase"
                description="If you ever switch between browsers or devices, you will need this seed phrase to access your accounts."
              />
              <FormMnemonicCreate name="seedPhrase" />

              <Label label="Password" description="A password is used to protect the wallet." />
              <FormPasswordInput name="password" />

              <Label label="Repeat Password" description="Please enter the password again." />
              <FormPasswordInput name="passwordConfirmation" />
            </View>

            <View>
              <Divider />

              <View style={styles.checkboxContainer}>
                <FormCheckbox name="acceptTerms" />
                <Text style={styles.checkboxText}>I made Seed Phrase backup</Text>
              </View>
              <Label
                description="And accept the risks that if I lose the phrase,
my funds may be lost."
              />

              <ButtonLargePrimary title="Create" disabled={!isValid} marginTop={formatSize(24)} onPress={submitForm} />
              <InsetSubstitute type="bottom" />
            </View>
          </>
        )}
      </Formik>
    </ScreenContainer>
  );
};
