import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormPasswordInput } from '../../form/form-password-input';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useShelter } from '../../shelter/use-shelter.hook';
import { useAnalytics } from '../../utils/analytics/use-analytics.hook';
import {
  EnableBiometryPasswordModalFormValues,
  enableBiometryPasswordModalInitialValues,
  enableBiometryPasswordModalValidationSchema
} from './enable-biometry-password-modal.form';

export const EnableBiometryPasswordModal = () => {
  const { enableBiometryPassword } = useShelter();

  const handleSubmit = ({ password }: EnableBiometryPasswordModalFormValues) => enableBiometryPassword(password);

  const { pageEvent } = useAnalytics();
  useEffect(() => void pageEvent(ModalsEnum.EnableBiometryPassword, ''), []);

  return (
    <Formik
      initialValues={enableBiometryPasswordModalInitialValues}
      validationSchema={enableBiometryPasswordModalValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Label label="Current password" description="A password is used to protect the wallet." />
            <FormPasswordInput name="password" />
          </View>

          <View>
            <ButtonsContainer>
              <ButtonLargePrimary title="Approve" onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
