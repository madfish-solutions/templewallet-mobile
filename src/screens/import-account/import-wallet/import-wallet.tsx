import { Formik } from 'formik';
import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../components/divider/divider';
import { HeaderBackButton } from '../../../components/header/header-back-button/header-back-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../../components/segmented-control/text-segment-control/text-segment-control';
import { FormCheckbox } from '../../../form/form-checkbox';
import { FormFileInput } from '../../../form/form-file-input';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { FormPasswordInput } from '../../../form/form-password-input';
import { formatSize } from '../../../styles/format-size';
import { showErrorToast } from '../../../toast/toast.utils';
import { decryptSeedPhrase } from '../../../utils/kukai.utils';
import {
  importWalletInitialValues,
  importWalletValidationSchema,
  importKukaiWalletInitialValues,
  importKukaiWalletValidationSchema,
  ImportKukaiWalletFormValues
} from './import-wallet.form';
import { useImportWalletStyles } from './import-wallet.styles';

export interface ImportWalletCredentials {
  seedPhrase: string;
  password?: string;
}

interface ImportWalletProps {
  onSubmit: (formValues: ImportWalletCredentials) => void;
}

const seedPhraseTabIndex = 0;

export const ImportWallet: FC<ImportWalletProps> = ({ onSubmit }) => {
  const styles = useImportWalletStyles();
  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showSeedPhraseForm = segmentedControlIndex === seedPhraseTabIndex;

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />,
      headerTitle: () => <HeaderTitle title="Import existing Wallet" />
    },
    []
  );

  const handleKukaiWalletSubmit = async (values: ImportKukaiWalletFormValues) => {
    try {
      const content = await RNFetchBlob.fs.readFile(values.keystoreFile.uri, 'utf8');
      const seedPhrase = await decryptSeedPhrase(content, values.password);
      onSubmit({
        seedPhrase,
        password: values.shouldUseFilePasswordForExtension ? values.password : undefined
      });
    } catch (e) {
      showErrorToast({ description: 'Wrong file, please select another one' });
    }
  };

  return (
    <ScreenContainer isFullScreenMode={true}>
      <TextSegmentControl
        selectedIndex={segmentedControlIndex}
        values={['Seed phrase', 'Keystore file']}
        onChange={setSegmentedControlIndex}
      />
      <Divider size={formatSize(32)} />

      {showSeedPhraseForm ? (
        <Formik
          initialValues={importWalletInitialValues}
          validationSchema={importWalletValidationSchema}
          onSubmit={onSubmit}>
          {({ submitForm, isValid }) => (
            <>
              <View style={styles.seedPhraseInputContainer}>
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
      ) : (
        <Formik
          initialValues={importKukaiWalletInitialValues}
          validationSchema={importKukaiWalletValidationSchema}
          onSubmit={handleKukaiWalletSubmit}>
          {({ isValid, submitForm, isSubmitting }) => (
            <>
              <View style={styles.seedPhraseInputContainer}>
                <View>
                  <Label label="File" description="Import your wallet from an encrypted keystore file (.tez)." />
                  <Divider size={formatSize(20)} />
                  <FormFileInput name="keystoreFile" mimeTypes={['application/octet-stream']} />
                  <Divider size={formatSize(12)} />
                  <Label label="File password" description="Please enter a password for keystore file" />
                  <FormPasswordInput name="password" />
                  <FormCheckbox name="shouldUseFilePasswordForExtension">
                    <Text style={styles.checkboxText}>Use File Password as Extension Password</Text>
                  </FormCheckbox>
                </View>
              </View>
              <Divider />

              <View>
                <ButtonLargePrimary title="Next" disabled={!isValid || isSubmitting} onPress={submitForm} />
                <InsetSubstitute type="bottom" />
              </View>
            </>
          )}
        </Formik>
      )}
    </ScreenContainer>
  );
};
