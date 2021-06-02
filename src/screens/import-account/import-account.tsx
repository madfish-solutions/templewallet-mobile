import { Formik } from 'formik';
import React from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../components/divider/divider';
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
import { useImportAccountStyles } from './import-account.styles';

export const ImportAccount = () => {
  const styles = useImportAccountStyles();
  const { importWallet } = useShelter();

  const onSubmit = ({ seedPhrase, password }: ImportAccountFormValues) => importWallet(seedPhrase, password);

  return (
    <Formik
      initialValues={importAccountInitialValues}
      validationSchema={importAccountValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Label label="Seed phrase" description="Mnemonic. Your secret 12 or more words." />
            <FormMnemonicInput name="seedPhrase" />

            <Label label="Password" description="A password is used to protect the wallet." />
            <FormPasswordInput name="password" />

            <Label label="Repeat Password" description="Please enter the password again." />
            <FormPasswordInput name="passwordConfirmation" />
          </View>

          <View>
            <View style={styles.checkboxContainer}>
              <FormCheckbox name="acceptTerms">
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Accept terms</Text>
              </FormCheckbox>
            </View>
            <Label
              description="I have read and agree to
the Terms of Usage and Privacy Policy"
            />

            <ButtonLargePrimary title="Import" disabled={!isValid} marginTop={formatSize(24)} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
