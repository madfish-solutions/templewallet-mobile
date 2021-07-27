import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from '../../../components/checkbox-description/checkbox-label';
import { Divider } from '../../../components/divider/divider';
import { HeaderBackButton } from '../../../components/header/header-back-button/header-back-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { NewSeedPhraseAttention } from '../../../components/new-seed-phrase-attention/new-seed-phrase-attention';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormCheckbox } from '../../../form/form-checkbox';
import { FormMnemonicCreate } from '../../../form/form-mnemonic-create';
import { formatSize } from '../../../styles/format-size';
import { isString } from '../../../utils/is-string';
import { createNewWalletValidationSchema, CreateNewWalletFormValues } from './create-new-wallet.form';
import { useCreateNewWalletStyles } from './create-new-wallet.styles';

interface CreateNewWalletProps {
  initialSeedPhrase: string;
  onSubmit: (formValues: CreateNewWalletFormValues) => void;
}

export const CreateNewWallet: FC<CreateNewWalletProps> = ({ initialSeedPhrase, onSubmit }) => {
  const styles = useCreateNewWalletStyles();

  const createNewWalletInitialValues: CreateNewWalletFormValues = useMemo(
    () => ({
      seedPhrase: initialSeedPhrase,
      madeSeedPhraseBackup: isString(initialSeedPhrase)
    }),
    [initialSeedPhrase]
  );

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />,
      headerTitle: () => <HeaderTitle title="Create a new Wallet" />
    },
    []
  );

  return (
    <Formik
      initialValues={createNewWalletInitialValues}
      validationSchema={createNewWalletValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <Divider size={formatSize(12)} />
          <View style={styles.seedPhraseInputContainer}>
            <Label
              label="Seed phrase"
              description="If you ever switch between browsers or devices, you will need this seed phrase to access your accounts."
            />
            <FormMnemonicCreate name="seedPhrase" />
          </View>

          <View>
            <NewSeedPhraseAttention />
            <Divider />
            <View style={styles.checkboxContainer}>
              <FormCheckbox name="madeSeedPhraseBackup">
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>I made Seed Phrase backup</Text>
              </FormCheckbox>
            </View>
            <CheckboxLabel>And accept the risks that if I lose the phrase,{'\n'}my funds may be lost.</CheckboxLabel>

            <Divider />
            <ButtonLargePrimary title="Next" disabled={!isValid} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
