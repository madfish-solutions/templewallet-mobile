import { Formik } from 'formik';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { RadioButton } from '../../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { FormPasswordInput } from '../../../form/form-password-input';
import { FormRadioButtonsGroup } from '../../../form/form-radio-buttons-group';
import { FormTextInput } from '../../../form/form-text-input';
import { ImportAccountDerivationEnum, ImportAccountSeedValues } from '../../../interfaces/import-account-type';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { useAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import {
  importAccountSeedFormInitialValues,
  importAccountSeedFormValidationSchema
} from '../import-account-modal.form';
import { useImportAccountModalStyles } from '../import-account-modal.styles';

interface Props {
  importAccountStep: number;
  setImportAccountStep: Dispatch<SetStateAction<number>>;
}

export const ImportAccountSeedForm: FC<Props> = ({ setImportAccountStep, importAccountStep }) => {
  const styles = useImportAccountModalStyles();
  const { createImportedAccountWithSeed } = useShelter();
  const accountsLength = useAccountsListSelector().length + 1;
  const derivationRadioButtons: RadioButton<ImportAccountDerivationEnum>[] = [
    { value: ImportAccountDerivationEnum.DEFAULT, label: 'Default account (the first one)' },
    { value: ImportAccountDerivationEnum.CUSTOM_PATH, label: 'Custom derivation path' }
  ];

  const onSubmit = (values: ImportAccountSeedValues) =>
    createImportedAccountWithSeed({
      name: `Account ${accountsLength}`,
      seedPhrase: values.seedPhrase,
      password: values.password,
      derivationPath: values.derivationPath
    });

  return (
    <Formik
      initialValues={importAccountSeedFormInitialValues}
      validationSchema={importAccountSeedFormValidationSchema}
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
            <FormRadioButtonsGroup name="derivation" buttons={derivationRadioButtons} />
            {values.derivation === ImportAccountDerivationEnum.CUSTOM_PATH && (
              <>
                <Label label="Custom derivation path" />
                <FormTextInput name="derivationPath" />
              </>
            )}
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Back" onPress={() => setImportAccountStep(importAccountStep - 1)} />
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
