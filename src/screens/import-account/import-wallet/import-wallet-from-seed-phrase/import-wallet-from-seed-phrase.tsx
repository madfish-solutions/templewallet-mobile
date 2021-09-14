import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../../components/divider/divider';
import { InsetSubstitute } from '../../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../../components/label/label';
import { FormMnemonicInput } from '../../../../form/form-mnemonic-input';
import { ImportWalletProps } from '../import-wallet';
import {
  importWalletFromSeedPhraseInitialValues,
  importWalletFromSeedPhraseValidationSchema
} from './import-wallet-from-seed-phrase.form';
import { ImportWalletFromSeedPhraseStyles } from './import-wallet-from-seed-phrase.styles';

export const ImportWalletFromSeedPhrase: FC<ImportWalletProps> = ({ onSubmit }) => (
  <Formik
    initialValues={importWalletFromSeedPhraseInitialValues}
    validationSchema={importWalletFromSeedPhraseValidationSchema}
    onSubmit={onSubmit}>
    {({ submitForm, isValid }) => (
      <>
        <View style={ImportWalletFromSeedPhraseStyles.seedPhraseInputContainer}>
          <Label label="Seed phrase" description="Mnemonic. Your secret 12 - 24 words phrase." />
          <FormMnemonicInput name="seedPhrase" />
        </View>
        <Divider />

        <View>
          <ButtonLargePrimary title="Next" disabled={!isValid} onPress={submitForm} />
          <InsetSubstitute type="bottom" />
        </View>
      </>
    )}
  </Formik>
);
