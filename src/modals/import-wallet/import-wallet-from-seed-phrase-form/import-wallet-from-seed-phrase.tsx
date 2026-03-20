import { FormikProvider, useFormik } from 'formik';
import React, { memo } from 'react';
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
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ImportWalletProps } from 'src/modals/import-wallet/interfaces';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import {
  importWalletFromSeedPhraseInitialValues,
  importWalletFromSeedPhraseValidationSchema
} from './import-wallet-from-seed-phrase.form';
import { ImportWalletFromSeedPhraseSelectors } from './import-wallet-from-seed-phrase.selectors';
import { useImportWalletFromSeedPhraseStyles } from './import-wallet-from-seed-phrase.styles';

export const ImportWalletFromSeedPhrase = memo<ImportWalletProps>(({ onSubmit, onBackPress }) => {
  const styles = useImportWalletFromSeedPhraseStyles();

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Import Seed Phrase" /> }, []);

  usePageAnalytic(ModalsEnum.ImportWalletFromSeedPhrase);

  const formik = useFormik({
    initialValues: importWalletFromSeedPhraseInitialValues,
    validationSchema: importWalletFromSeedPhraseValidationSchema,
    onSubmit
  });

  return (
    <FormikProvider value={formik}>
      <ScreenContainer isFullScreenMode={true}>
        <Divider size={formatSize(16)} />

        <View style={styles.seedPhraseInputContainer}>
          <Label label="Seed phrase" description="Mnemonic. Your secret 12 - 24 words phrase." />
          <FormMnemonicInput name="seedPhrase" testID={ImportWalletFromSeedPhraseSelectors.seedPhraseInput} />
          <AndroidKeyboardDisclaimer />
        </View>
      </ScreenContainer>

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary
          title="Back"
          onPress={onBackPress}
          testID={ImportWalletFromSeedPhraseSelectors.backButton}
        />
        <ButtonLargePrimary
          title="Next"
          disabled={!formik.isValid}
          onPress={formik.submitForm}
          testID={ImportWalletFromSeedPhraseSelectors.nextButton}
        />
      </ModalButtonsFloatingContainer>
    </FormikProvider>
  );
});
