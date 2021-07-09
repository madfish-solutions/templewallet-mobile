import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormPasswordInput } from '../../form/form-password-input';
import { useBiometryAvailability } from '../../hooks/use-biometry-availability.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { setBiometricsEnabled } from '../../store/settings/settings-actions';
import { showErrorToast } from '../../toast/toast.utils';
import { isDefined } from '../../utils/is-defined';
import { ApprovePasswordModalFormValues, approvePasswordModalValidationSchema } from './approve-password-modal.form';

export const ApprovePasswordModal = () => {
  const { shouldEnableBiometry } = useRoute<RouteProp<ModalsParamList, ModalsEnum.ApprovePassword>>().params;
  const { activeBiometryType, createBiometricKeys } = useBiometryAvailability();
  const { goBack } = useNavigation();
  const { passwordIsCorrect } = useShelter();
  const dispatch = useDispatch();

  const ApprovePasswordModalInitialValues = { password: '' };

  const handleSubmit = async ({ password }: ApprovePasswordModalFormValues) => {
    if (passwordIsCorrect(password)) {
      if (shouldEnableBiometry && isDefined(activeBiometryType)) {
        try {
          await createBiometricKeys();
        } catch (e) {
          showErrorToast('Error', e.message);

          return;
        }
      }
      dispatch(setBiometricsEnabled(shouldEnableBiometry));
      goBack();
    } else {
      showErrorToast('Wrong password', 'Please, try again');
    }
  };

  return (
    <Formik
      initialValues={ApprovePasswordModalInitialValues}
      validationSchema={approvePasswordModalValidationSchema}
      onSubmit={handleSubmit}>
      {({ submitForm, isSubmitting }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Label label="Current password" description="A password is used to protect the wallet." />
            <FormPasswordInput name="password" />
          </View>

          <View>
            <ButtonsContainer>
              <ButtonLargePrimary disabled={isSubmitting} title="Approve" onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
