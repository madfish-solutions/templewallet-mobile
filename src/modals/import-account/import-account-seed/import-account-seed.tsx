import { FormikProvider, useFormik } from 'formik';
import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AndroidKeyboardDisclaimer } from 'src/components/android-keyboard-disclaimer/android-keyboard-disclaimer';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ImportAccountDerivationEnum } from 'src/enums/account-type.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { FormMnemonicInput } from 'src/form/form-mnemonic-input';
import { FormPasswordInput } from 'src/form/form-password-input';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { useIsShowLoaderSelector } from 'src/store/settings/settings-selectors';
import { useAccountsListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { mnemonicToPrivateKey } from 'src/utils/keys.utils';
import { extractHdIndexFromDerivationPath, getSaplingDerivationPath } from 'src/utils/sapling/address-utils';
import { InMemorySpendingKey } from 'src/utils/sapling/sapling-keys/in-memory-spending-key';

import { ImportAccountChainForm } from '../import-account-chain.form';

import { useImportAccountFromSeedStyles } from './import-account-from-seed.styles';
import { ImportAccountSeedDerivationPathForm } from './import-account-seed-derivation-path.form';
import {
  getDefaultImportAccountSeedDerivationPath,
  importAccountSeedInitialValues,
  importAccountSeedValidationSchema,
  ImportAccountSeedValues
} from './import-account-seed.form';
import { ImportAccountSeedSelectors } from './import-account-seed.selectors';

interface Props {
  onBackPress: EmptyFn;
}

export const ImportAccountSeed = memo<Props>(({ onBackPress }) => {
  const dispatch = useDispatch();
  const styles = useImportAccountFromSeedStyles();
  const { createImportedAccount } = useShelter();
  const accountsIndex = useAccountsListSelector().length + 1;

  const isLoading = useIsShowLoaderSelector();

  usePageAnalytic(ModalsEnum.ImportAccountFromSeedPhrase);

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Import Seed Phrase" /> }, []);

  const onSubmit = useCallback(
    ({ seedPhrase, password, derivationPath }: ImportAccountSeedValues) => {
      dispatch(showLoaderAction());

      setTimeout(async () => {
        try {
          const privateKeyResult = mnemonicToPrivateKey(
            seedPhrase,
            message => new Error(message),
            password,
            derivationPath
          );

          if (privateKeyResult.chain === TempleChainKind.EVM) {
            createImportedAccount({
              name: `Account ${accountsIndex}`,
              privateKey: privateKeyResult.privateKey,
              chain: TempleChainKind.EVM
            });

            return;
          }

          const hdIndex = extractHdIndexFromDerivationPath(derivationPath);
          const saplingSpendingKey = await InMemorySpendingKey.deriveSaskFromMnemonic(
            seedPhrase,
            getSaplingDerivationPath(hdIndex)
          );

          createImportedAccount({
            name: `Account ${accountsIndex}`,
            privateKey: privateKeyResult.privateKey,
            chain: TempleChainKind.Tezos,
            saplingSpendingKey
          });
        } catch {
          dispatch(hideLoaderAction());
          showErrorToast({
            title: 'Failed to import account.',
            description: 'This may happen because provided Seed Phrase is invalid.'
          });
        }
      }, 0);
    },
    [accountsIndex, createImportedAccount, dispatch]
  );

  const formik = useFormik({
    initialValues: importAccountSeedInitialValues,
    validationSchema: importAccountSeedValidationSchema,
    validateOnBlur: false,
    validateOnChange: true,
    validateOnMount: false,
    onSubmit
  });

  const onChainChange = useCallback(
    (nextChain: TempleChainKind) => {
      if (formik.values.derivationType === ImportAccountDerivationEnum.DEFAULT) {
        formik.setFieldValue('derivationPath', getDefaultImportAccountSeedDerivationPath(nextChain));
      }
    },
    [formik]
  );

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
          <Label label="Chain" />
          <ImportAccountChainForm onChange={onChainChange} />
          <Divider size={formatSize(12)} />
          <Label
            label="Derivation"
            isOptional
            description="By default derivation isn't used. Click on 'Custom derivation path' to add it."
          />
          <ImportAccountSeedDerivationPathForm formValues={formik.values} />
          <Divider size={formatSize(12)} />
          <Label
            label="Password"
            isOptional
            description={'That is NOT a wallet password.\nUsed for additional mnemonic derivation.'}
          />
          <FormPasswordInput name="password" testID={ImportAccountSeedSelectors.passwordInput} />
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
