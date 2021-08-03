import { Formik } from 'formik';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { FormMnemonicInput } from '../../../form/form-mnemonic-input';
import { ImportAccountPrivateKeyValues } from '../../../interfaces/import-account-type';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { useAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import {
  importAccountPrivateKeyFormInitialValues,
  importAccountPrivateKeyFormValidationSchema
} from '../import-account-modal.form';

interface Props {
  importAccountStep: number;
  setImportAccountStep: Dispatch<SetStateAction<number>>;
}

export const ImportAccountPrivateKeyForm: FC<Props> = ({ importAccountStep, setImportAccountStep }) => {
  const { createImportedAccountWithPrivateKey } = useShelter();
  const accountLength = useAccountsListSelector().length + 1;
  const onSubmit = ({ privateKey }: ImportAccountPrivateKeyValues) => {
    createImportedAccountWithPrivateKey({
      privateKey,
      name: `Account ${accountLength}`
    });
  };

  return (
    <Formik
      initialValues={importAccountPrivateKeyFormInitialValues}
      validationSchema={importAccountPrivateKeyFormValidationSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode>
          <View>
            <Divider size={formatSize(12)} />
            <Label label="Private key" description="The Secret key of the Account you want to import." />
            <FormMnemonicInput name="privateKey" placeholder="e.g. AFVEWNWEQwt34QRVGEWBFDSAd" />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Back" onPress={() => setImportAccountStep(importAccountStep - 1)} />
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
