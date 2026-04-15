import { validateMnemonic } from 'bip39';
import { FormikProvider, useFormik } from 'formik';
import React, { memo, useCallback } from 'react';
import { Text, View } from 'react-native';
import { readFile } from 'react-native-fs';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import {
  AT_LEAST_ONE_LOWER_CASE_REGX,
  AT_LEAST_ONE_NUMBER_REGX,
  AT_LEAST_ONE_UPPER_CASE_REGX,
  MIN_CHARS_REGX,
  SPECIAL_CHARACTER_REGX
} from 'src/config/security';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormFileInput } from 'src/form/form-file-input';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ImportWalletProps } from 'src/modals/import-wallet/interfaces';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { decryptSeedPhrase, KUKAI_VERSION_ERROR } from 'src/utils/kukai.utils';

import {
  ImportWalletFromKeystoreFileFormValues,
  importWalletFromKeystoreFileInitialValues,
  importWalletFromKeystoreFileValidationSchema
} from './import-wallet-from-keystore-file.form';
import { useImportWalletFromKeystoreFileStyles } from './import-wallet-from-keystore-file.styles';

const checkKukaiPasswordValid = (password: string): boolean =>
  [
    AT_LEAST_ONE_LOWER_CASE_REGX,
    AT_LEAST_ONE_NUMBER_REGX,
    AT_LEAST_ONE_UPPER_CASE_REGX,
    MIN_CHARS_REGX,
    SPECIAL_CHARACTER_REGX
  ].every(rule => rule.test(password));

const TOO_WEAK_PASSWORD_ERROR =
  'The password is too weak. Please, set a new one according to the requirements of the application.';

export const ImportWalletFromKeystoreFile = memo<ImportWalletProps>(({ onSubmit, onBackPress }) => {
  const styles = useImportWalletFromKeystoreFileStyles();

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Import Keystore File" /> }, []);

  usePageAnalytic(ModalsEnum.ImportWalletFromKeystoreFile);

  const handleSubmit = useCallback(
    async ({ shouldUseFilePasswordForExtension, password, keystoreFile }: ImportWalletFromKeystoreFileFormValues) => {
      try {
        if (shouldUseFilePasswordForExtension && !checkKukaiPasswordValid(password)) {
          throw new Error(TOO_WEAK_PASSWORD_ERROR);
        }
        const content = await readFile(keystoreFile.uri, 'utf8');
        const seedPhrase = await decryptSeedPhrase(content, password);
        if (!validateMnemonic(seedPhrase)) {
          throw new Error('Mnemonic not validated');
        }
        onSubmit({
          seedPhrase,
          password: shouldUseFilePasswordForExtension ? password : undefined
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
    },
    []
  );

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

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary title="Back" onPress={onBackPress} />
        <ButtonLargePrimary title="Next" disabled={!isValid || isSubmitting} onPress={submitForm} />
      </ModalButtonsFloatingContainer>
    </FormikProvider>
  );
});
