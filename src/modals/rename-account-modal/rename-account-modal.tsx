import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormTextInput } from '../../form/form-text-input';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { updateWalletAccountAction } from '../../store/wallet/wallet-actions';
import { formatSize } from '../../styles/format-size';
import { RenameAccountModalFormValues, renameAccountModalValidationSchema } from './rename-account-modal.form';

export const RenameAccountModal = () => {
  const account = useRoute<RouteProp<ModalsParamList, ModalsEnum.RenameAccount>>().params.account;
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const createHdAccountInitialValues: RenameAccountModalFormValues = {
    name: account.name
  };

  const onSubmit = ({ name }: RenameAccountModalFormValues) => {
    dispatch(updateWalletAccountAction({ ...account, name }));
    goBack();
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={createHdAccountInitialValues}
      validationSchema={renameAccountModalValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm }) => (
        <ScreenContainer isFullScreenMode={true}>
          <ModalStatusBar />
          <View>
            <Label label="Name" description="Rename your account by any name you wish." />
            <FormTextInput name="name" />

            <Divider />
          </View>

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Save" onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
