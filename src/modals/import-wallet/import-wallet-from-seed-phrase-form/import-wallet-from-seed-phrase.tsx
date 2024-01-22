import { FormikProvider, useFormik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { AndroidKeyboardDisclaimer } from 'src/components/android-keyboard-disclaimer/android-keyboard-disclaimer';
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
import { FormMnemonicInput } from 'src/form/form-mnemonic-input';
import { ImportWalletProps } from 'src/modals/import-wallet/interfaces';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';

import {
  importWalletFromSeedPhraseInitialValues,
  importWalletFromSeedPhraseValidationSchema
} from './import-wallet-from-seed-phrase.form';
import { ImportWalletFromSeedPhraseSelectors } from './import-wallet-from-seed-phrase.selectors';
import { useImportWalletFromSeedPhraseStyles } from './import-wallet-from-seed-phrase.styles';

export const ImportWalletFromSeedPhrase: FC<ImportWalletProps> = ({ onSubmit }) => {
  const { goBack } = useNavigation();
  const styles = useImportWalletFromSeedPhraseStyles();

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Import Seed Phrase" /> }, []);

  const formik = useFormik({
    initialValues: importWalletFromSeedPhraseInitialValues,
    validationSchema: importWalletFromSeedPhraseValidationSchema,
    onSubmit
  });

  return (
    <FormikProvider value={formik}>
      <ScreenContainer>
        <Divider />

        <View style={styles.seedPhraseInputContainer}>
          <Label label="Seed phrase" description="Mnemonic. Your secret 12 - 24 words phrase." />
          <FormMnemonicInput name="seedPhrase" testID={ImportWalletFromSeedPhraseSelectors.seedPhraseInput} />
          <AndroidKeyboardDisclaimer />
        </View>
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonsContainer style={styles.buttonsContainer}>
          <View style={styles.flex}>
            <ButtonLargeSecondary
              title="Back"
              onPress={goBack}
              testID={ImportWalletFromSeedPhraseSelectors.backButton}
            />
          </View>
          <Divider size={formatSize(15)} />
          <View style={styles.flex}>
            <ButtonLargePrimary
              title="Next"
              disabled={!formik.isValid}
              onPress={formik.submitForm}
              testID={ImportWalletFromSeedPhraseSelectors.nextButton}
            />
          </View>
        </ButtonsContainer>
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
};
