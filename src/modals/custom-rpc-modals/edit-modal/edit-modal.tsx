import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { IconTitleNoBg } from 'src/components/icon-title-no-bg/icon-title-no-bg';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { RpcInterface } from 'src/interfaces/rpc.interface';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams, useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { editCustomRpc, removeCustomRpc } from 'src/store/settings/settings-actions';
import { useRpcListSelector } from 'src/store/settings/settings-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { buildSafeURL } from 'src/utils/url.utils';

import { formInitialValues, formValidationSchema, confirmUniqueRPC } from '../form.utils';

import { EditModalSelectors } from './edit-modal.selectors';
import { useEditModalStyles } from './styles';

export const EditCustomRpcModal: FC = () => {
  const { url } = useModalParams<ModalsEnum.EditCustomRpc>();

  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { trackEvent } = useAnalytics();
  const rpcList = useRpcListSelector();
  const styles = useEditModalStyles();

  const initialValues = useMemo(() => {
    const rpc = rpcList.find(rpc => rpc.url === url);
    if (rpc == null) {
      return formInitialValues;
    }

    return rpc;
  }, [url]);

  const handleSubmit = (values: RpcInterface) => {
    const index = rpcList.findIndex(rpc => rpc.url === url);

    if (index < 0) {
      return void showErrorToast({ description: `RPC not found ${initialValues.name}(${initialValues.url})` });
    }

    const otherItems = [...rpcList];
    otherItems.splice(index, 1);

    const isUrlValid = buildSafeURL(values.url?.trim());
    if (!isUrlValid) {
      showErrorToast({ description: 'App loading failed due to RPC URL. Verify the URL and try again.' });

      return;
    }

    if (confirmUniqueRPC(otherItems, values) === false) {
      return;
    }

    dispatch(editCustomRpc({ url, values }));

    goBack();
  };

  const onDeleteButtonPress = () =>
    Alert.alert(`Delete ${initialValues.name}?`, 'You can add network in the "Default Node (RPC)" section.', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(removeCustomRpc(url));
          goBack();
          trackEvent(EditModalSelectors.deleteRpcButton, AnalyticsEventCategory.ButtonPress);
        }
      }
    ]);

  usePageAnalytic(ModalsEnum.EditCustomRpc);

  return (
    <Formik initialValues={initialValues} validationSchema={formValidationSchema} onSubmit={handleSubmit}>
      {({ submitForm, isValid }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <ModalStatusBar />

            <View>
              <Label label="Name" />
              <FormTextInput name="name" placeholder="My custom network" testID={EditModalSelectors.nameInput} />

              <Label label="URL" />
              <FormTextInput
                name="url"
                placeholder="http://localhost:4444"
                autoCapitalize="none"
                testID={EditModalSelectors.urlInput}
              />

              <IconTitleNoBg
                icon={IconNameEnum.Trash}
                text="Delete RPC"
                textStyle={styles.destructive}
                onPress={onDeleteButtonPress}
                testID={EditModalSelectors.deleteRpcButton}
              />
            </View>
          </ScreenContainer>
          <ModalButtonsFloatingContainer>
            <ButtonLargeSecondary title="Close" onPress={goBack} testID={EditModalSelectors.closeButton} />
            <ButtonLargePrimary
              title="Save"
              disabled={!isValid}
              onPress={submitForm}
              testID={EditModalSelectors.saveButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
