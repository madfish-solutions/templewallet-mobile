import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AccountFormDropdown } from '../../components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormNumericInput } from '../../form/form-numeric-input';
import { FormTextInput } from '../../form/form-text-input';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { sendAssetActions } from '../../store/wallet/wallet-actions';
import { useHdAccountsListSelector, useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

export const SendModal: FC = () => {
  const dispatch = useDispatch();
  const { asset } = useRoute<RouteProp<ModalsParamList, ModalsEnum.Send>>().params;
  const { goBack } = useNavigation();

  const hdAccounts = useHdAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const sendModalInitialValues = useMemo<SendModalFormValues>(
    () => ({
      sender: selectedAccount,
      receiverPublicKeyHash: '',
      amount: undefined
    }),
    [selectedAccount]
  );

  const onSubmit = ({ sender, receiverPublicKeyHash, amount }: SendModalFormValues) =>
    void (
      isDefined(amount) &&
      dispatch(
        sendAssetActions.submit({
          asset,
          sender,
          receiverPublicKeyHash,
          amount: amount.toNumber()
        })
      )
    );

  return (
    <Formik initialValues={sendModalInitialValues} validationSchema={sendModalValidationSchema} onSubmit={onSubmit}>
      {({ submitForm }) => (
        <ScreenContainer isFullScreenMode={true}>
          <ModalStatusBar />
          <View>
            <Label label="From" description="Select account to send from." />
            <AccountFormDropdown name="sender" list={hdAccounts} />
            <Divider />

            <Label label="To" description={`Address or Tezos domain to send ${asset.symbol} funds to.`} />
            <FormTextInput name="receiverPublicKeyHash" />
            <Divider />

            <Label label="Amount" description={`Set ${asset.symbol} amount to send.`} />
            <FormNumericInput name="amount" decimals={asset.decimals} />
            <Divider />
          </View>

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={goBack} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Send" onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
