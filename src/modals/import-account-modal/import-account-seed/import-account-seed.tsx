import { mnemonicToSeedSync } from 'bip39';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { AndroidKeyboardDisclaimer } from '../../../components/android-keyboard-disclaimer/android-keyboard-disclaimer';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EmptyFn } from '../../../config/general';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { FormPasswordInput } from '../../../form/form-password-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { useAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { isString } from '../../../utils/is-string';
import { seedToPrivateKey } from '../../../utils/keys.util';
import { useImportAccountStyles } from '../import-account.styles';
import { ImportAccountSeedDerivationPathForm } from './import-account-seed-derivation-path.form';
import {
  importAccountSeedInitialValues,
  importAccountSeedValidationSchema,
  ImportAccountSeedValues
} from './import-account-seed.form';

interface Props {
  onBackHandler: EmptyFn;
}

export const ImportAccountSeed: FC<Props> = ({ onBackHandler }) => {
  const styles = useImportAccountStyles();
  const { createImportedAccount } = useShelter();
  const accountsIndex = useAccountsListSelector().length + 1;

  const onSubmit = (values: ImportAccountSeedValues) => {
    const seed = mnemonicToSeedSync(values.seedPhrase, values.password);
    const privateKey = seedToPrivateKey(seed, isString(values.derivationPath) ? values.derivationPath : undefined);

    createImportedAccount({
      name: `Account ${accountsIndex}`,
      privateKey
    });
  };

  return (
    <Formik
      initialValues={importAccountSeedInitialValues}
      validationSchema={importAccountSeedValidationSchema}
      enableReinitialize={true}
      onSubmit={onSubmit}
    >
      {({ values, submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Divider size={formatSize(12)} />
            <View style={styles.seedPhraseInputContainer}>
              <Label label="Seed phrase" description="Mnemonic. Your secret 12 - 24 words phrase." />
              <FormMnemonicInput name="seedPhrase" />
            </View>
            <AndroidKeyboardDisclaimer />
            <Divider size={formatSize(12)} />
            <Label
              label="Derivation"
              isOptional
              description="By default derivation isn't used. Click on 'Custom derivation path' to add it."
            />
            <ImportAccountSeedDerivationPathForm formValues={values} />
            <Divider size={formatSize(12)} />
            <Label
              label="Password"
              isOptional
              description={'Used for additional mnemonic derivation.\nThat is NOT a wallet password.'}
            />
            <FormPasswordInput name="password" />
            <Divider size={formatSize(12)} />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Back" onPress={onBackHandler} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Import" disabled={!isValid} onPress={submitForm} />
            </ButtonsContainer>
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
