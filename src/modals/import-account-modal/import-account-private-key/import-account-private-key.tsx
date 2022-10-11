import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AndroidKeyboardDisclaimer } from '../../../components/android-keyboard-disclaimer/android-keyboard-disclaimer';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EmptyFn } from '../../../config/general';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { setLoadingAction } from '../../../store/settings/settings-actions';
import { useAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import {
  importAccountPrivateKeyInitialValues,
  importAccountPrivateKeyValidationSchema
} from './import-account-private-key.form';

interface Props {
  onBackHandler: EmptyFn;
}

export const ImportAccountPrivateKey: FC<Props> = ({ onBackHandler }) => {
  const { createImportedAccount } = useShelter();
  const dispatch = useDispatch();
  const accountIndex = useAccountsListSelector().length + 1;
  const onSubmit = ({ privateKey }: { privateKey: string }) => {
    dispatch(setLoadingAction(true));

    createImportedAccount({
      privateKey,
      name: `Account ${accountIndex}`
    });
  };

  return (
    <Formik
      initialValues={importAccountPrivateKeyInitialValues}
      validationSchema={importAccountPrivateKeyValidationSchema}
      enableReinitialize={true}
      onSubmit={onSubmit}
    >
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode>
          <View>
            <Divider size={formatSize(12)} />
            <Label label="Private key" description="The Secret key of the Account you want to import." />
            <FormMnemonicInput name="privateKey" placeholder="e.g. AFVEWNWEQwt34QRVGEWBFDSAd" />
            <AndroidKeyboardDisclaimer />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Back" onPress={onBackHandler} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Import" disabled={!isValid} onPress={submitForm} />
            </ButtonsContainer>
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
