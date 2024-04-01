import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { IconTitleNoBg } from 'src/components/icon-title-no-bg/icon-title-no-bg';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { RpcInterface } from 'src/interfaces/rpc.interface';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { editCustomRpc, removeCustomRpc } from 'src/store/settings/settings-actions';
import { useRpcListSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { formInitialValues, formValidationSchema, confirmUniqueRPC } from '../form.utils';

import { EditModalSelectors } from './edit-modal.selectors';
import { useEditModalStyles } from './styles';

export const EditCustomRpcModal: FC = () => {
  const { url } = useRoute<RouteProp<ModalsParamList, ModalsEnum.EditCustomRpc>>().params;

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

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} testID={EditModalSelectors.closeButton} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary
                title="Save"
                disabled={!isValid}
                onPress={submitForm}
                testID={EditModalSelectors.saveButton}
              />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
