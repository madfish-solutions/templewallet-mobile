import { Formik } from 'formik';
import React, { FC, useState } from 'react';
import { Alert, View } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
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
import { isAndroid } from '../../../config/system';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { ImportService } from '../../../kukai/import.service';
import { formatSize } from '../../../styles/format-size';
import { importWalletInitialValues, importWalletValidationSchema, ImportWalletFormValues } from './import-wallet.form';
import { useImportWalletStyles } from './import-wallet.styles';

type ImportWalletProps = {
  onSubmit: (formValues: ImportWalletFormValues) => void;
};

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

  const readSeedPhrase = async () => {
    try {
      let pickResult: DocumentPickerResponse;
      if (isAndroid) {
        pickResult = await DocumentPicker.pick<'android'>({
          type: ['*/*']
        });
      } else {
        pickResult = await DocumentPicker.pick<'ios'>({
          type: ['public.item']
        });
      }
      console.log('Reading file...');
      const content = await RNFetchBlob.fs.readFile(pickResult.uri, 'utf8');
      console.log('Decrypting...');
      const seedPhrase = await ImportService.getSeedPhrase(content, 'pYLgol7eFt3s08E6');
      Alert.alert('Seed phrase', seedPhrase);
    } catch (e) {
      if (e.message !== 'User canceled document picker') {
        console.error(e);
      }
    }
  };

  return (
    <ScreenContainer isFullScreenMode={true}>
      <TextSegmentControl
        selectedIndex={segmentedControlIndex}
        values={['Seed phrase', 'Keystore file']}
        onChange={setSegmentedControlIndex}
      />

      {showSeedPhraseForm ? (
        <Formik
          initialValues={importWalletInitialValues}
          validationSchema={importWalletValidationSchema}
          onSubmit={onSubmit}>
          {({ submitForm, isValid }) => (
            <>
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
            </>
          )}
        </Formik>
      ) : (
        <ButtonLargePrimary title="Read seed phrase" onPress={readSeedPhrase} />
      )}
    </ScreenContainer>
  );
};
