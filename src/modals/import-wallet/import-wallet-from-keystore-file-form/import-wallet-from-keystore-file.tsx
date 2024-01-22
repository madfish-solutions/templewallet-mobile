import { validateMnemonic } from 'bip39';
import { FormikProvider, useFormik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { readFile } from 'react-native-fs';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import {
  LETTERS_NUMBERS_MIXTURE_REGX,
  MIN_PASSWORD_LENGTH,
  UPPER_CASE_LOWER_CASE_MIXTURE_REGX
} from 'src/config/security';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormFileInput } from 'src/form/form-file-input';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ImportWalletProps } from 'src/modals/import-wallet/interfaces';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { decryptSeedPhrase, KUKAI_VERSION_ERROR } from 'src/utils/kukai.utils';

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
  const { goBack } = useNavigation();
  const styles = useImportWalletFromKeystoreFileStyles();

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Import Keystore File" /> }, []);

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

  const formik = useFormik({
    initialValues: importWalletFromKeystoreFileInitialValues,
    validationSchema: importWalletFromKeystoreFileValidationSchema,
    onSubmit: handleSubmit
  });

  const { isValid, submitForm, isSubmitting, values } = formik;

  return (
    <FormikProvider value={formik}>
      <ScreenContainer isFullScreenMode={true}>
        <Divider />

        <View style={styles.seedPhraseInputContainer}>
          <View>
            <Label label="File" description="Import your wallet from an encrypted keystore file (.tez)." />
            <FormFileInput name="keystoreFile" />
            <Divider size={formatSize(12)} />
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
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonsContainer style={styles.buttonsContainer}>
          <View style={styles.flex}>
            <ButtonLargeSecondary title="Back" onPress={goBack} />
          </View>
          <Divider size={formatSize(15)} />
          <View style={styles.flex}>
            <ButtonLargePrimary title="Next" disabled={!isValid || isSubmitting} onPress={submitForm} />
          </View>
        </ButtonsContainer>
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
};
