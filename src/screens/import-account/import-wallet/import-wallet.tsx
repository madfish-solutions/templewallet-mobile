import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../components/divider/divider';
import { HeaderBackButton } from '../../../components/header/header-back-button/header-back-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { submitSeedPhraseAction } from '../../../store/wallet/wallet-actions';
import { formatSize } from '../../../styles/format-size';
import { importWalletInitialValues, importWalletValidationSchema, ImportWalletFormValues } from './import-wallet.form';
import { useImportWalletStyles } from './import-wallet.styles';

type ImportWalletProps = {
  onFormSubmitted: () => void;
};

export const ImportWallet: FC<ImportWalletProps> = ({ onFormSubmitted }) => {
  const dispatch = useDispatch();
  const styles = useImportWalletStyles();

  const handleSubmit = ({ seedPhrase }: ImportWalletFormValues) => {
    dispatch(submitSeedPhraseAction(seedPhrase));
    onFormSubmitted();
  };

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
      onSubmit={handleSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <Divider size={formatSize(12)} />
          <View style={styles.seedPhraseInputContainer}>
            <Label label="Seed phrase" description="Mnemonic. Your secret 12 or more words." />
            <FormMnemonicInput name="seedPhrase" />
          </View>

          <View>
            <ButtonLargePrimary title="Next" disabled={!isValid} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
