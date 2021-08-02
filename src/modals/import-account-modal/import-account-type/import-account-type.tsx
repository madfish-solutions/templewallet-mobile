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
import { RadioButton } from '../../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { FormRadioButtonsGroup } from '../../../form/form-radio-buttons-group';
import { ImportAccountTypeEnum, ImportAccountTypeValues } from '../../../interfaces/import-account-type';
import { formatSize } from '../../../styles/format-size';
import { importAccountTypeInitialValues, importAccountTypeValidationSchema } from '../import-account-modal.form';

interface Props {
  importAccountStep: number;
  setImportAccountStep: Dispatch<SetStateAction<number>>;
  setImportType: Dispatch<SetStateAction<ImportAccountTypeEnum>>;
}

export const ImportAccountType: FC<Props> = ({ importAccountStep, setImportAccountStep, setImportType }) => {
  const typeRadioButtons: RadioButton<ImportAccountTypeEnum>[] = [
    { value: ImportAccountTypeEnum.PRIVATE_KEY, label: 'Private key' },
    { value: ImportAccountTypeEnum.SEED_PHRASE, label: 'Seed phrase' }
  ];

  const submitFormHandler = ({ type }: ImportAccountTypeValues) => {
    setImportType(type);
    setImportAccountStep(importAccountStep + 1);
  };

  return (
    <Formik
      validationSchema={importAccountTypeValidationSchema}
      initialValues={importAccountTypeInitialValues}
      onSubmit={submitFormHandler}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Divider size={formatSize(12)} />
            <Label label="Type of import" description="Select how would you like to import account." />
            <FormRadioButtonsGroup name="type" buttons={typeRadioButtons} />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={() => console.log('test')} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Next" disabled={!isValid} onPress={submitForm} />
            </ButtonsContainer>
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
