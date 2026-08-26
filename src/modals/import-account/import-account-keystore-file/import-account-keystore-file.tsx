import { validateMnemonic } from 'bip39';
import { FormikProvider, useFormik } from 'formik';
import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { readFile } from 'react-native-fs';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormFileInput } from 'src/form/form-file-input';
import { FormPasswordInput } from 'src/form/form-password-input';
import { FormTextInput } from 'src/form/form-text-input';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { useIsShowLoaderSelector } from 'src/store/settings/settings-selectors';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { getTezosDerivationPath } from 'src/utils/keys.utils';
import { decryptSeedPhrase, KUKAI_VERSION_ERROR } from 'src/utils/kukai.utils';

import {
  ImportAccountKeystoreFileFormValues,
  importAccountKeystoreFileInitialValues,
  importAccountKeystoreFileValidationSchema
} from './import-account-keystore-file.form';
import { ImportAccountKeystoreFileSelectors } from './import-account-keystore-file.selectors.ts';
import { useImportAccountKeystoreFileStyles } from './import-account-keystore-file.styles';

interface Props {
  onBackPress: EmptyFn;
}

export const ImportAccountKeystoreFile = memo<Props>(({ onBackPress }) => {
  const styles = useImportAccountKeystoreFileStyles();
  const { createImportedChainAccountFromSeed } = useShelter();
  const accountIndex = useAllAccounts().length + 1;
  const isLoading = useIsShowLoaderSelector();

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Import Keystore File" /> }, []);

  usePageAnalytic(ModalsEnum.ImportAccountFromKeystoreFile);

  const handleSubmit = useCallback(
    async ({ password, keystoreFile, derivationPath }: ImportAccountKeystoreFileFormValues) => {
      try {
        const content = await readFile(keystoreFile.uri, 'utf8');
        const seedPhrase = await decryptSeedPhrase(content, password);
        const trimmedDerivationPath = derivationPath?.trim();

        if (!validateMnemonic(seedPhrase)) {
          throw new Error('Mnemonic not validated');
        }

        createImportedChainAccountFromSeed({
          seedPhrase,
          name: `Account ${accountIndex}`,
          derivationPath: trimmedDerivationPath || getTezosDerivationPath(0)
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
    [accountIndex, createImportedChainAccountFromSeed]
  );

  const formik = useFormik({
    initialValues: importAccountKeystoreFileInitialValues,
    validationSchema: importAccountKeystoreFileValidationSchema,
    onSubmit: handleSubmit
  });

  const { isValid, submitForm, isSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <ScreenContainer isFullScreenMode={true}>
        <Divider />

        <View style={styles.seedPhraseInputContainer}>
          <View>
            <Label label="File" description="Import your account from an encrypted keystore file (.tez)." />
            <FormFileInput name="keystoreFile" />
            <Divider size={formatSize(12)} />
            <Label label="File password" description="Please enter a password for keystore file" />
            <FormPasswordInput name="password" testID={ImportAccountKeystoreFileSelectors.passwordInput} />
            <Divider size={formatSize(12)} />
            <Label label="Custom derivation path" isOptional />
            <FormTextInput
              name="derivationPath"
              placeholder="e.g. m/44'/1729'/0'/0'"
              testID={ImportAccountKeystoreFileSelectors.derivationPathInput}
            />
          </View>
        </View>
        <Divider />
      </ScreenContainer>

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary
          title="Back"
          onPress={onBackPress}
          testID={ImportAccountKeystoreFileSelectors.backButton}
        />
        <ButtonLargePrimary
          title="Import"
          disabled={!isValid || isSubmitting || isLoading}
          onPress={useCallbackIfOnline(submitForm)}
          testID={ImportAccountKeystoreFileSelectors.importButton}
        />
      </ModalButtonsFloatingContainer>
    </FormikProvider>
  );
});
