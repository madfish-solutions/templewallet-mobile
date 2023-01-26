import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { View, Text, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { RpcInterface } from 'src/interfaces/rpc.interface';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { editCustomRpc, removeCustomRpc, setSelectedRpcUrl } from 'src/store/settings/settings-actions';
import { useRpcListSelector, useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { editCustomRpcFormValidationSchema } from './edit-custom-rpc.form';
import { useStyles } from './styles';

export const EditCustomRpcModal: FC = () => {
  const { url } = useRoute<RouteProp<ModalsParamList, ModalsEnum.EditCustomRpc>>().params;

  const styles = useStyles();

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
        }
      }
    ]);

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

          <TouchableOpacity style={styles.fullWidthBtn} onPress={onDeleteButtonPress}>
            <Icon name={IconNameEnum.Trash} />
            <Text style={styles.fullWidthBtnText}>Delete RPC</Text>
          </TouchableOpacity>

          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <View style={{ flexGrow: 1 }} />

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
