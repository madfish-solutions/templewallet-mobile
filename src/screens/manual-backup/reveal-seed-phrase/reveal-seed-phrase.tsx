import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { CheckboxLabel } from 'src/components/checkbox-description/checkbox-label';
import { Divider } from 'src/components/divider/divider';
import { HeaderBackButton } from 'src/components/header/header-back-button/header-back-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { NewSeedPhraseAttention } from 'src/components/new-seed-phrase-attention/new-seed-phrase-attention';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormCheckbox } from 'src/form/form-checkbox';
import { RevealSeedPhraseView } from 'src/modals/reveal-seed-phrase-modal/reveal-seed-phrase-form-content/reveal-seed-phrase-view/reveal-seed-phrase-view';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';

import {
  createNewWalletValidationSchema,
  CreateNewWalletFormValues,
  createNewWalletInitialValues
} from './reveal-seed-phrase.form';
import { RevealSeedPhraseSelectors } from './reveal-seed-phrase.selectors';
import { useCreateNewWalletStyles } from './reveal-seed-phrase.styles';

interface Props {
  onSubmit: (formValues: CreateNewWalletFormValues) => void;
}

export const RevealSeedPhrase: FC<Props> = ({ onSubmit }) => {
  const styles = useCreateNewWalletStyles();
  const accountPkh = useCurrentAccountPkhSelector();

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />,
      headerTitle: () => <HeaderTitle title="Manual backup" />
    },
    []
  );

  return (
    <Formik
      initialValues={createNewWalletInitialValues}
      validationSchema={createNewWalletValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <Divider size={formatSize(12)} />
          <View style={styles.seedPhraseInputContainer}>
            <Label
              label="Seed phrase"
              description="If you ever switch between browsers or devices, you will need this seed phrase to access your accounts."
            />
            <RevealSeedPhraseView
              publicKeyHash={accountPkh}
              testID={RevealSeedPhraseSelectors.tapToRevealProtectedMask}
            />
          </View>

          <View>
            <NewSeedPhraseAttention />
            <Divider />
            <View style={styles.checkboxContainer}>
              <FormCheckbox name="madeSeedPhraseBackup" testID={RevealSeedPhraseSelectors.madeSeedPhraseBackupCheckbox}>
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>I made Seed Phrase backup</Text>
              </FormCheckbox>
            </View>
            <CheckboxLabel>And accept the risks that if I lose the phrase,{'\n'}my funds may be lost.</CheckboxLabel>
            <Divider />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargePrimary
                title="Next"
                disabled={!isValid}
                onPress={submitForm}
                testID={RevealSeedPhraseSelectors.nextButton}
              />
            </ButtonsContainer>
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
