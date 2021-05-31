import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC, useCallback, useMemo } from 'react';
import { View } from 'react-native';

import { AccountFormDropdown } from '../../components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormNumericInput } from '../../form/form-numeric-input';
import { FormTextInput } from '../../form/form-text-input';
import { ConfirmPayloadType } from '../../interfaces/confirm-payload/confirm-payload-type.enum';
import { ModalsEnum } from '../../navigator/modals.enum';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useHdAccountsListSelector, useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { MAINNET_NETWORK } from '../../utils/network/networks';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

export const SendModal: FC = () => {
  const { goBack, navigate } = useNavigation();
  const hdAccounts = useHdAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const SendBottomSheetInitialValues: SendModalFormValues = useMemo(
    () => ({
      account: selectedAccount,
      amount: new BigNumber(0),
      recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne'
    }),
    []
  );

  // TODO: integrate gasFee with send request
  const onSubmit = useCallback(
    (data: SendModalFormValues) =>
      navigate(ModalsEnum.Confirm, {
        type: ConfirmPayloadType.internalOperations,
        networkRpc: MAINNET_NETWORK.rpcBaseURL,
        sourcePkh: data.account.publicKeyHash,
        opParams: [{ kind: 'transaction', amount: data.amount.times(1e6).toString(), to: data.recipient, mutez: true }]
      }),
    []
  );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={SendBottomSheetInitialValues}
      validationSchema={sendModalValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Label label="From" description="Select account to send from." />
            <AccountFormDropdown name="account" list={hdAccounts} />
            <Divider />

            <Label label="To" description="Address or Tezos domain to send tez funds to." />
            <FormTextInput name="recipient" />
            <Divider />

            <Label label="Amount" description="Set XTZ amount to send." />
            <FormNumericInput name="amount" decimals={6} min={0} />
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
