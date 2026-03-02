import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { updateAccountAction } from 'src/store/wallet/wallet-actions';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { RenameAccountModalFormValues, renameAccountModalValidationSchema } from './rename-account-modal.form';
import { RenameAccountModalSelectors } from './rename-account-modal.selectors';

export const RenameAccountModal = () => {
  const { account } = useModalParams<ModalsEnum.RenameAccount>();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  const createHdAccountInitialValues: RenameAccountModalFormValues = {
    name: account.name
  };

  const onSubmit = ({ name }: RenameAccountModalFormValues) => {
    dispatch(updateAccountAction({ ...account, name }));
    goBack();
  };

  usePageAnalytic(ModalsEnum.RenameAccount);

  return (
    <Formik
      enableReinitialize={true} // (!) Might lead to unwanted form resets.
      initialValues={createHdAccountInitialValues}
      validationSchema={renameAccountModalValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <ModalStatusBar />
            <View>
              <Label label="Name" description="Rename your account by any name you wish." />
              <FormTextInput name="name" testID={RenameAccountModalSelectors.nameInput} />

              <Divider />
            </View>
          </ScreenContainer>
          <ModalButtonsFloatingContainer>
            <ButtonLargeSecondary title="Close" onPress={goBack} testID={RenameAccountModalSelectors.closeButton} />
            <ButtonLargePrimary title="Save" onPress={submitForm} testID={RenameAccountModalSelectors.saveButton} />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
