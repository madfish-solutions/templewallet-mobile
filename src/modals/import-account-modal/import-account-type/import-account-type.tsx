import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EventFn } from '../../../config/general';
import { ImportAccountTypeEnum } from '../../../enums/account-type.enum';
import { FormRadioButtonsGroup } from '../../../form/form-radio-buttons-group';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { importAccountTypeInitialValues, importAccountTypeValidationSchema } from './import-account-type.form';

interface Props {
  onSubmit: EventFn<ImportAccountTypeEnum>;
}

const importAccountTypeButtons = [
  { value: ImportAccountTypeEnum.PRIVATE_KEY, label: 'Private key' },
  { value: ImportAccountTypeEnum.SEED_PHRASE, label: 'Seed phrase' }
];

export const ImportAccountType: FC<Props> = ({ onSubmit }) => {
  const { goBack } = useNavigation();

  return (
    <Formik
      validationSchema={importAccountTypeValidationSchema}
      initialValues={importAccountTypeInitialValues}
      onSubmit={({ type }) => onSubmit(type)}
    >
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Divider size={formatSize(12)} />
            <Label label="Type of import" description="Select how would you like to import account." />
            <FormRadioButtonsGroup name="type" items={importAccountTypeButtons} />
          </View>
          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} />
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
