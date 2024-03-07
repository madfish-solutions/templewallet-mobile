import { FormikProvider, useFormik } from 'formik';
import React, { memo, useCallback } from 'react';
import { View } from 'react-native';

import { AndroidKeyboardDisclaimer } from 'src/components/android-keyboard-disclaimer/android-keyboard-disclaimer';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormMnemonicInput } from 'src/form/form-mnemonic-input';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { useAccountsListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useImportAccountFromPrivateKeyStyles } from './import-account-from-private-key.styles';
import {
  importAccountPrivateKeyInitialValues,
  importAccountPrivateKeyValidationSchema
} from './import-account-private-key.form';
import { ImportAccountPrivateKeySelectors } from './import-account-private-key.selectors';

export const ImportAccountPrivateKey = memo(() => {
  const { createImportedAccount } = useShelter();
  const accountIndex = useAccountsListSelector().length + 1;
  const { goBack } = useNavigation();
  const styles = useImportAccountFromPrivateKeyStyles();

  const handleNoInternet = useCallbackIfOnline();

  usePageAnalytic(ModalsEnum.ImportAccountFromPrivateKey);

  const onSubmit = useCallback(({ privateKey }: { privateKey: string }) => {
    createImportedAccount({
      privateKey,
      name: `Account ${accountIndex}`
    });

    goBack();
  }, []);

  const formik = useFormik({
    initialValues: importAccountPrivateKeyInitialValues,
    validationSchema: importAccountPrivateKeyValidationSchema,
    onSubmit
  });

  return (
    <FormikProvider value={formik}>
      <ScreenContainer>
        <View>
          <Divider size={formatSize(12)} />
          <Label label="Private key" description="The Secret Key of the account you want to import." />
          <FormMnemonicInput
            name="privateKey"
            placeholder="e.g. AFVEWNWEQwt34QRVGEWBFDSAd"
            testID={ImportAccountPrivateKeySelectors.privateKeyInput}
          />
          <AndroidKeyboardDisclaimer />
        </View>
      </ScreenContainer>
      <ButtonsFloatingContainer>
        <ButtonsContainer style={styles.buttonsContainer}>
          <View style={styles.flex}>
            <ButtonLargeSecondary title="Back" onPress={goBack} testID={ImportAccountPrivateKeySelectors.backButton} />
          </View>
          <Divider size={formatSize(15)} />
          <View style={styles.flex}>
            <ButtonLargePrimary
              title="Import"
              disabled={!formik.isValid}
              onPress={handleNoInternet(formik.submitForm)}
              testID={ImportAccountPrivateKeySelectors.importButton}
            />
          </View>
        </ButtonsContainer>
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
});
