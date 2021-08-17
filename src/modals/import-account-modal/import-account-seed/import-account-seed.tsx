import { mnemonicToSeedSync } from 'bip39';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EmptyFn } from '../../../config/general';
import { ImportAccountDerivationEnum } from '../../../enums/account-type.enum';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { FormPasswordInput } from '../../../form/form-password-input';
import { FormRadioButtonsGroup } from '../../../form/form-radio-buttons-group';
import { FormTextInput } from '../../../form/form-text-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { useAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { seedToHDPrivateKey } from '../../../utils/keys.util';
import { useImportAccountStyles } from '../import-account.styles';
import {
  importAccountSeedInitialValues,
  importAccountSeedValidationSchema,
  ImportAccountSeedValues
} from './import-account-seed.form';

interface Props {
  onBackHandler: EmptyFn;
}

const derivationTypeButtons = [
  { value: ImportAccountDerivationEnum.DEFAULT, label: 'Default account (the first one)' },
  { value: ImportAccountDerivationEnum.CUSTOM_PATH, label: 'Custom derivation path' }
];

export const ImportAccountSeed: FC<Props> = ({ onBackHandler }) => {
  const styles = useImportAccountStyles();
  const { createImportedAccount } = useShelter();
  const accountsIndex = useAccountsListSelector().length + 1;

  const onSubmit = (values: ImportAccountSeedValues) => {
    const seed = mnemonicToSeedSync(values.seedPhrase);
    const privateKey = seedToHDPrivateKey(seed, values.derivationType);
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
      onSubmit={onSubmit}>
      {({ values, submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Divider size={formatSize(12)} />
            <View style={styles.seedPhraseInputContainer}>
              <Label label="Seed phrase" description="Mnemonic. Your secret 12 or more words." />
              <FormMnemonicInput name="seedPhrase" />
            </View>
            <Divider size={formatSize(12)} />
            <Label
              label="Password"
              isOptional
              description={'Used for additional mnemonic derivation.\nThat is NOT a wallet password.'}
            />
            <FormPasswordInput name="password" />
            <Divider size={formatSize(12)} />
            <Label
              label="Derivation"
              isOptional
              description="By default derivation isn't used. Click on 'Custom derivation path' to add it."
            />
            <FormRadioButtonsGroup name="derivationType" buttons={derivationTypeButtons} />
            {values.derivationType === ImportAccountDerivationEnum.CUSTOM_PATH && (
              <>
                <Label label="Custom derivation path" />
                <FormTextInput name="derivationPath" />
              </>
            )}
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
