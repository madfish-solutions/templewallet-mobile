import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { EventFn } from 'src/config/general';
import { ImportAccountTypeEnum } from 'src/enums/account-type.enum';
import { FormRadioButtonsGroup } from 'src/form/form-radio-buttons-group';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';

import { importAccountTypeInitialValues, importAccountTypeValidationSchema } from './import-account-type.form';
import { ImportAccountTypeSelectors } from './import-account-type.selectors';

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
              <ButtonLargeSecondary title="Close" onPress={goBack} testID={ImportAccountTypeSelectors.closeButton} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary
                title="Next"
                disabled={!isValid}
                onPress={submitForm}
                testID={ImportAccountTypeSelectors.nextButton}
              />
            </ButtonsContainer>
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
