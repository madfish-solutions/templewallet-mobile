import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { RpcInterface } from 'src/interfaces/rpc.interface';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { editCustomRpc, setSelectedRpcUrl } from 'src/store/settings/settings-actions';
import { useRpcListSelector, useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { editCustomRpcFormValidationSchema } from './edit-custom-rpc.form';

export const EditCustomRpcModal: FC = () => {
  const { url } = useRoute<RouteProp<ModalsParamList, ModalsEnum.EditCustomRpc>>().params;

  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const rpcList = useRpcListSelector();
  const selected = useSelectedRpcUrlSelector();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const initialValues = useMemo(() => rpcList.find(rpc => rpc.url === url), [url])!;

  const handleSubmit = (values: RpcInterface) => {
    const index = rpcList.findIndex(rpc => rpc.url === url);

    if (index < 0) {
      return void showErrorToast({ description: `RPC not found ${initialValues.name}(${initialValues.url})` });
    }

    const list = [...rpcList];
    list.splice(index, 1);
    const duplicate = list.find(rpc => rpc.name === values.name || rpc.url === values.url);

    if (duplicate != null) {
      return void showErrorToast({ description: `RPC already exists ${duplicate.name}(${duplicate.url})` });
    }

    list.splice(index, 0, values);

    dispatch(editCustomRpc(list));
    if (url === selected) {
      dispatch(setSelectedRpcUrl(values.url));
    }

    goBack();
  };

  usePageAnalytic(ModalsEnum.EditCustomRpc);

  return (
    <Formik initialValues={initialValues} validationSchema={editCustomRpcFormValidationSchema} onSubmit={handleSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <ModalStatusBar />

          <View>
            <Label label="Name" />
            <FormTextInput name="name" placeholder="My custom network" />

            <Label label="URL" />
            <FormTextInput name="url" placeholder="http://localhost:4444" autoCapitalize="none" />
          </View>

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Save" disabled={!isValid} onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
