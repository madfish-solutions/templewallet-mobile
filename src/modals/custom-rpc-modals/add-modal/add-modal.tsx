import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { RpcInterface } from 'src/interfaces/rpc.interface';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { addCustomRpc, setSelectedRpcUrl } from 'src/store/settings/settings-actions';
import { useRpcListSelector } from 'src/store/settings/settings-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { buildSafeURL } from 'src/utils/url.utils';

import { formInitialValues, formValidationSchema, confirmUniqueRPC } from '../form.utils';

import { AddModalSelectors } from './add-modal.selectors';

export const AddCustomRpcModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const rpcList = useRpcListSelector();

  const handleSubmit = (newRpc: RpcInterface) => {
    const isUrlValid = buildSafeURL(newRpc.url?.trim());
    if (!isUrlValid) {
      showErrorToast({ description: 'App loading failed due to RPC URL. Verify the URL and try again.' });

      return;
    }

    if (confirmUniqueRPC(rpcList, newRpc) === false) {
      return;
    }

    dispatch(addCustomRpc(newRpc));
    dispatch(setSelectedRpcUrl(newRpc.url));
    goBack();
  };

  usePageAnalytic(ModalsEnum.AddCustomRpc);

  return (
    <Formik initialValues={formInitialValues} validationSchema={formValidationSchema} onSubmit={handleSubmit}>
      {({ submitForm, isValid }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <ModalStatusBar />

            <View>
              <Label label="Name" />
              <FormTextInput name="name" placeholder="My custom network" testID={AddModalSelectors.nameInput} />

              <Label label="URL" />
              <FormTextInput
                name="url"
                placeholder="http://localhost:4444"
                autoCapitalize="none"
                testID={AddModalSelectors.urlInput}
              />
            </View>
          </ScreenContainer>
          <ModalButtonsFloatingContainer>
            <ButtonLargeSecondary title="Close" onPress={goBack} testID={AddModalSelectors.closeButton} />
            <ButtonLargePrimary
              title="Add"
              disabled={!isValid}
              onPress={submitForm}
              testID={AddModalSelectors.addButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
