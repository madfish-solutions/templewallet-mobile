import { FormikProvider, useFormik } from 'formik';
import React, { memo, useCallback } from 'react';
import { View } from 'react-native';

import { AndroidKeyboardDisclaimer } from 'src/components/android-keyboard-disclaimer/android-keyboard-disclaimer';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormMnemonicInput } from 'src/form/form-mnemonic-input';
import { FormTextInput } from 'src/form/form-text-input.tsx';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { useIsShowLoaderSelector } from 'src/store/settings/settings-selectors';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useImportAccountFromSeedStyles } from './import-account-from-seed.styles';
import {
  importAccountSeedInitialValues,
  importAccountSeedValidationSchema,
  ImportAccountSeedValues
} from './import-account-seed.form';
import { ImportAccountSeedSelectors } from './import-account-seed.selectors';

interface Props {
  onBackPress: EmptyFn;
}

export const ImportAccountSeed = memo<Props>(({ onBackPress }) => {
  const styles = useImportAccountFromSeedStyles();
  const { createImportedAccountFromSeed, createImportedMultichainAccount } = useShelter();
  const accountsIndex = useAllAccounts().length + 1;

  const isLoading = useIsShowLoaderSelector();

  usePageAnalytic(ModalsEnum.ImportAccountFromSeedPhrase);

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Import Seed Phrase" /> }, []);

  const onSubmit = useCallback(
    ({ seedPhrase, derivationPath }: ImportAccountSeedValues) => {
      const trimmedDerivationPath = derivationPath?.trim();
      const params = {
        name: `Account ${accountsIndex}`,
        seedPhrase
      };

      if (trimmedDerivationPath) {
        createImportedAccountFromSeed({
          ...params,
          derivationPath: trimmedDerivationPath
        });

        return;
      }

      createImportedMultichainAccount(params);
    },
    [accountsIndex, createImportedAccountFromSeed, createImportedMultichainAccount]
  );

  const formik = useFormik({
    initialValues: importAccountSeedInitialValues,
    validationSchema: importAccountSeedValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit
  });

  return (
    <FormikProvider value={formik}>
      <ScreenContainer>
        <View>
          <Divider size={formatSize(12)} />
          <View style={styles.seedPhraseInputContainer}>
            <Label label="Seed phrase" description="Mnemonic. Your secret 12 - 24 words phrase." />
            <FormMnemonicInput name="seedPhrase" testID={ImportAccountSeedSelectors.seedPhraseInput} />
          </View>
          <AndroidKeyboardDisclaimer />
          <Divider size={formatSize(12)} />
          <Label label="Custom derivation path" isOptional />
          <FormTextInput
            name="derivationPath"
            placeholder="e.g. m/44'/60'/0'/0/0"
            testID={ImportAccountSeedSelectors.derivationPathInput}
          />
          <Divider size={formatSize(12)} />
        </View>
      </ScreenContainer>
      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary title="Back" onPress={onBackPress} testID={ImportAccountSeedSelectors.backButton} />
        <ButtonLargePrimary
          title="Import"
          disabled={!formik.isValid || isLoading}
          onPress={useCallbackIfOnline(formik.submitForm)}
          testID={ImportAccountSeedSelectors.importButton}
        />
      </ModalButtonsFloatingContainer>
    </FormikProvider>
  );
});
