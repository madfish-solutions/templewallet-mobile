import { Formik } from 'formik';
import React, { FC } from 'react';
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
import { RpcTypeEnum } from '../../enums/rpc-type.enum';
import { FormTextInput } from '../../form/form-text-input';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { addCustomRpc, setSelectedRpcUrl } from '../../store/settings/settings-actions';
import { useRpcListSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { showErrorToast } from '../../toast/toast.utils';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { isDefined } from '../../utils/is-defined';
import {
  addCustomRpcFormInitialValues,
  addCustomRpcFormValidationSchema,
  AddCustomRpcFormValues
} from './add-custom-rpc.form';

export const AddCustomRpcModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const rpcList = useRpcListSelector();

  const handleSubmit = (newRpc: AddCustomRpcFormValues) => {
    const duplicate = rpcList.find(rpc => rpc.name === newRpc.name || rpc.url === newRpc.url);

    if (isDefined(duplicate)) {
      showErrorToast({ description: `RPC already exist ${duplicate.name}(${duplicate.url})` });
    } else {
      dispatch(addCustomRpc({ ...newRpc, type: RpcTypeEnum.MAIN }));
      dispatch(setSelectedRpcUrl(newRpc.url));
      goBack();
    }
  };

  usePageAnalytic(ModalsEnum.AddCustomRpc);

  return (
    <Formik
      initialValues={addCustomRpcFormInitialValues}
      validationSchema={addCustomRpcFormValidationSchema}
      onSubmit={handleSubmit}
    >
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
              <ButtonLargePrimary title="Add" disabled={!isValid} onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
