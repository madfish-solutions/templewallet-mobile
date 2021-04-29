import { Formik } from 'formik';
import React, { FC } from 'react';
import { Button, Text } from 'react-native';

import { AccountFormDropdown } from '../../../components/account-form-dropdown/account-form-dropdown';
import { BottomSheetStateProps } from '../../../components/bottom-sheet/bottom-sheet-state.props';
import { ModalBottomSheet } from '../../../components/bottom-sheet/modal-bottom-sheet/modal-bottom-sheet';
import { FormTextInput } from '../../../form/form-text-input';
import { emptyAccount } from '../../../interfaces/account.interface';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { useWalletSelector } from '../../../store/wallet/wallet-selectors';
import { SendBottomSheetFormValues, sendBottomSheetValidationSchema } from './send-bottom-sheet.form';

interface Props extends BottomSheetStateProps {
  balance?: string;
}

export const SendBottomSheet: FC<Props> = ({ isOpen, onCloseEnd, balance }) => {
  const { send } = useShelter();
  const hdAccounts = useWalletSelector().hdAccounts;

  const SendBottomSheetInitialValues: SendBottomSheetFormValues = {
    account: hdAccounts[0] ?? emptyAccount,
    amount: '0',
    recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne'
  };

  const onSubmit = (data: SendBottomSheetFormValues) => send(data.account.publicKeyHash, data.amount, data.recipient);

  return (
    <ModalBottomSheet title="Send" isOpen={isOpen} onCloseEnd={onCloseEnd}>
      <Formik
        enableReinitialize={true}
        initialValues={SendBottomSheetInitialValues}
        validationSchema={sendBottomSheetValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm }) => (
          <>
            <Text>From</Text>
            <AccountFormDropdown name="account" list={hdAccounts} />

            <Text>Amount Tezos</Text>
            {/*TODO: replace with NumberInput*/}
            <FormTextInput name="amount" />

            <Text>Recipient</Text>
            <FormTextInput name="recipient" />

            <Button title="Send" onPress={submitForm} />
          </>
        )}
      </Formik>
    </ModalBottomSheet>
  );
};
