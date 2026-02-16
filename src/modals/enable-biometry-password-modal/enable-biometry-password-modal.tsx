import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import {
  EnableBiometryPasswordModalFormValues,
  enableBiometryPasswordModalInitialValues,
  enableBiometryPasswordModalValidationSchema
} from './enable-biometry-password-modal.form';
import { EnableBiometryPasswordModalSelectors } from './enable-biometry-password-modal.selectors';

export const EnableBiometryPasswordModal = () => {
  const { enableBiometryPassword } = useShelter();

  const handleSubmit = ({ password }: EnableBiometryPasswordModalFormValues) => enableBiometryPassword(password);

  usePageAnalytic(ModalsEnum.EnableBiometryPassword);

  return (
    <Formik
      initialValues={enableBiometryPasswordModalInitialValues}
      validationSchema={enableBiometryPasswordModalValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Label label="Current password" description="A password is used to protect the wallet." />
              <FormPasswordInput name="password" testID={EnableBiometryPasswordModalSelectors.currentPasswordInput} />
            </View>
          </ScreenContainer>
          <ModalButtonsFloatingContainer>
            <ButtonLargePrimary
              title="Approve"
              onPress={submitForm}
              testID={EnableBiometryPasswordModalSelectors.approveButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
