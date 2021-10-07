import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { readFile } from 'react-native-fs';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../../components/divider/divider';
import { InsetSubstitute } from '../../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../../components/label/label';
import { FormCheckbox } from '../../../../form/form-checkbox';
import { FormFileInput } from '../../../../form/form-file-input';
import { FormPasswordInput } from '../../../../form/form-password-input';
import { formatSize } from '../../../../styles/format-size';
import { showErrorToast } from '../../../../toast/toast.utils';
import { decryptSeedPhrase } from '../../../../utils/kukai.utils';
import { ImportWalletProps } from '../import-wallet';
import {
  ImportWalletFromKeystoreFileFormValues,
  importWalletFromKeystoreFileInitialValues,
  importWalletFromKeystoreFileValidationSchema
} from './import-wallet-from-keystore-file.form';
import { useImportWalletFromKeystoreFileStyles } from './import-wallet-from-keystore-file.styles';

export const ImportWalletFromKeystoreFile: FC<ImportWalletProps> = ({ onSubmit }) => {
  const styles = useImportWalletFromKeystoreFileStyles();

  const handleSubmit = async (values: ImportWalletFromKeystoreFileFormValues) => {
    try {
      const content = await readFile(values.keystoreFile.uri, 'utf8');
      const seedPhrase = await decryptSeedPhrase(content, values.password);
      onSubmit({
        seedPhrase,
        password: values.shouldUseFilePasswordForExtension ? values.password : undefined
      });
    } catch {
      showErrorToast({
        title: 'Wrong file or password',
        description: 'Please change one of them and try again'
      });
    }
  };

  return (
    <Formik
      initialValues={importWalletFromKeystoreFileInitialValues}
      validationSchema={importWalletFromKeystoreFileValidationSchema}
      onSubmit={handleSubmit}>
      {({ isValid, submitForm, isSubmitting }) => (
        <>
          <View style={styles.seedPhraseInputContainer}>
            <View>
              <Label label="File" description="Import your wallet from an encrypted keystore file (.tez)." />
              <Divider size={formatSize(20)} />
              <FormFileInput name="keystoreFile" />
              <Divider size={formatSize(12)} />
              <Label label="File password" description="Please enter a password for keystore file" />
              <FormPasswordInput name="password" />
              <FormCheckbox name="shouldUseFilePasswordForExtension">
                <Text style={styles.checkboxText}>Use this password as App password</Text>
              </FormCheckbox>
            </View>
          </View>
          <Divider />

          <View>
            <ButtonLargePrimary title="Next" disabled={!isValid || isSubmitting} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
