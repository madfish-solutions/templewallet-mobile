import { FormikProvider, useFormik } from 'formik';
import React, { memo, useCallback } from 'react';
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
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { useAccountsListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import {
  importAccountPrivateKeyInitialValues,
  importAccountPrivateKeyValidationSchema
} from './import-account-private-key.form';
import { ImportAccountPrivateKeySelectors } from './import-account-private-key.selectors';

interface Props {
  onBackPress: EmptyFn;
}

export const ImportAccountPrivateKey = memo<Props>(({ onBackPress }) => {
  const { createImportedAccount } = useShelter();
  const accountIndex = useAccountsListSelector().length + 1;
  const { goBack } = useNavigation();

  usePageAnalytic(ModalsEnum.ImportAccountFromPrivateKey);

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Import Private Key" /> }, []);

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
      <ModalButtonsFloatingContainer>
        <ButtonLargeSecondary title="Back" onPress={onBackPress} testID={ImportAccountPrivateKeySelectors.backButton} />
        <ButtonLargePrimary
          title="Import"
          disabled={!formik.isValid}
          onPress={useCallbackIfOnline(formik.submitForm)}
          testID={ImportAccountPrivateKeySelectors.importButton}
        />
      </ModalButtonsFloatingContainer>
    </FormikProvider>
  );
});
