import { validateMnemonic } from 'bip39';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { readFile } from 'react-native-fs';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import {
  LETTERS_NUMBERS_MIXTURE_REGX,
  MIN_PASSWORD_LENGTH,
  UPPER_CASE_LOWER_CASE_MIXTURE_REGX
} from 'src/config/security';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormFileInput } from 'src/form/form-file-input';
import { FormPasswordInput } from 'src/form/form-password-input';
import { showErrorToast } from 'src/toast/toast.utils';
import { decryptSeedPhrase, KUKAI_VERSION_ERROR } from 'src/utils/kukai.utils';

import type { ImportWalletProps } from '../import-wallet';

import {
  ImportWalletFromKeystoreFileFormValues,
  importWalletFromKeystoreFileInitialValues,
  importWalletFromKeystoreFileValidationSchema
} from './import-wallet-from-keystore-file.form';
import { useImportWalletFromKeystoreFileStyles } from './import-wallet-from-keystore-file.styles';

const checkKukaiPasswordValid = (password: string): boolean =>
  password.length >= MIN_PASSWORD_LENGTH &&
  UPPER_CASE_LOWER_CASE_MIXTURE_REGX.test(password) &&
  LETTERS_NUMBERS_MIXTURE_REGX.test(password);

const TOO_WEAK_PASSWORD_ERROR =
  'The password is too weak. Please, set a new one according to the requirements of the application.';

export const ImportWalletFromKeystoreFile: FC<ImportWalletProps> = ({ onSubmit }) => {
  const styles = useImportWalletFromKeystoreFileStyles();

  const handleSubmit = async (values: ImportWalletFromKeystoreFileFormValues) => {
    try {
      if (values.shouldUseFilePasswordForExtension && !checkKukaiPasswordValid(values.password)) {
        throw new Error(TOO_WEAK_PASSWORD_ERROR);
      }
      const content = await readFile(values.keystoreFile.uri, 'utf8');
      const seedPhrase = await decryptSeedPhrase(content, values.password);
      if (!validateMnemonic(seedPhrase)) {
        throw new Error('Mnemonic not validated');
      }
      onSubmit({
        seedPhrase,
        password: values.shouldUseFilePasswordForExtension ? values.password : undefined
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.message === KUKAI_VERSION_ERROR) {
        showErrorToast({
          title: 'Cannot import',
          description: KUKAI_VERSION_ERROR
        });
      } else {
        showErrorToast({
          title: 'Wrong file or password',
          description: 'Please change one of them and try again'
        });
      }
    }
  };

  return (
    <Formik
      initialValues={importWalletFromKeystoreFileInitialValues}
      validationSchema={importWalletFromKeystoreFileValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, submitForm, isSubmitting, values }) => (
        <>
          <View style={styles.seedPhraseInputContainer}>
            <View>
              <Label label="File" description="Import your wallet from an encrypted keystore file (.tez)." />
              <FormFileInput name="keystoreFile" />
              <Label label="File password" description="Please enter a password for keystore file" />
              <FormPasswordInput name="password" />
              <FormCheckbox
                {...(values.shouldUseFilePasswordForExtension &&
                  !checkKukaiPasswordValid(values.password) && {
                    error:
                      'The "keystore file" password is too weak to use as an app password. You need to set a new one.'
                  })}
                name="shouldUseFilePasswordForExtension"
              >
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
