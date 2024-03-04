import { TezosToolkit } from '@taquito/taquito';
import { Formik } from 'formik';
import React, { FC } from 'react';
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
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { addCustomRpc, setSelectedRpcUrl } from 'src/store/settings/settings-actions';
import { useRpcListSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { showWarningToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { TALENT_MAINNET_CHAIN_ID } from 'src/utils/network.utils';

import { formInitialValues, formValidationSchema, confirmUniqueRPC } from '../form.utils';

import { AddModalSelectors } from './add-modal.selectors';

export const AddCustomRpcModal: FC = () => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const rpcList = useRpcListSelector();

  const handleSubmit = async (newRpc: RpcInterface) => {
    if (confirmUniqueRPC(rpcList, newRpc) === false) {
      return;
    }

    let isTalentNet = false;
    try {
      const tezos = new TezosToolkit(newRpc.url);
      const chainId = await tezos.rpc.getChainId();
      isTalentNet = chainId === TALENT_MAINNET_CHAIN_ID;
    } catch (e) {
      console.error(e);
    }

    if (isTalentNet) {
      showWarningToast({ description: 'The T4L3NT Mainnet RPC is temporarily unavailable.' });
    } else {
      dispatch(addCustomRpc(newRpc));
      dispatch(setSelectedRpcUrl(newRpc.url));
      goBack();
    }
  };

  usePageAnalytic(ModalsEnum.AddCustomRpc);

  return (
    <Formik initialValues={formInitialValues} validationSchema={formValidationSchema} onSubmit={handleSubmit}>
      {({ submitForm, isValid }) => (
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

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} testID={AddModalSelectors.closeButton} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary
                title="Add"
                disabled={!isValid}
                onPress={submitForm}
                testID={AddModalSelectors.addButton}
              />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
