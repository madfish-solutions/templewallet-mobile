import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import {
  EnterCloudPasswordFormValues,
  EnterCloudPasswordInitialValues,
  EnterCloudPasswordValidationSchema
} from './form';
import { EnterCloudPasswordSelectors } from './selectors';

export const CloudBackup = () => {
  usePageAnalytic(ScreensEnum.CloudBackup);

  const handleSubmit = (values: EnterCloudPasswordFormValues) => {
    console.log('Values: ', values);
  };

  return (
    <Formik
      initialValues={EnterCloudPasswordInitialValues}
      validationSchema={EnterCloudPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isValid }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Divider size={formatSize(12)} />
              <Label label="Backup Password" description="Enter your wallet password to confirm backup." />
              <FormPasswordInput name="password" testID={EnterCloudPasswordSelectors.PasswordInput} />
            </View>
          </ScreenContainer>

          <View>
            <ButtonLargePrimary
              title="Confirm"
              disabled={!isValid}
              onPress={submitForm}
              testID={EnterCloudPasswordSelectors.ConfirmButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
