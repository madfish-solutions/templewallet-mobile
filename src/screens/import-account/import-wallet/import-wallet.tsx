import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../components/divider/divider';
import { HeaderBackButton } from '../../../components/header/header-back-button/header-back-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { formatSize } from '../../../styles/format-size';
import { importWalletInitialValues, importWalletValidationSchema, ImportWalletFormValues } from './import-wallet.form';
import { useImportWalletStyles } from './import-wallet.styles';

type ImportWalletProps = {
  onSubmit: (formValues: ImportWalletFormValues) => void;
};

export const ImportWallet: FC<ImportWalletProps> = ({ onSubmit }) => {
  const styles = useImportWalletStyles();

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />,
      headerTitle: () => <HeaderTitle title="Import existing Wallet" />
    },
    []
  );

  return (
    <Formik
      initialValues={importWalletInitialValues}
      validationSchema={importWalletValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <Divider size={formatSize(12)} />
          <View style={styles.seedPhraseInputContainer}>
            <Label label="Seed phrase" description="Mnemonic. Your secret 12 or more words." />
            <FormMnemonicInput name="seedPhrase" />
          </View>
          <Divider />

          <View>
            <ButtonLargePrimary title="Next" disabled={!isValid} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
