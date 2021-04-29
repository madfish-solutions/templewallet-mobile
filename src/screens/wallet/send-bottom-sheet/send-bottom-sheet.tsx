import { Formik } from 'formik';
import React, { FC, useState } from 'react';
import { Button, Text } from 'react-native';

import { AccountDropdown } from '../../../components/account-dropdown/account-dropdown';
import { BottomSheetStateProps } from '../../../components/bottom-sheet/bottom-sheet-state.props';
import { ModalBottomSheet } from '../../../components/bottom-sheet/modal-bottom-sheet/modal-bottom-sheet';
import { FormTextInput } from '../../../form/form-text-input';
import { AccountInterface } from '../../../interfaces/account.interface';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { useWalletSelector } from '../../../store/wallet/wallet-selectors';
import {
  SendBottomSheetFormValues,
  SendBottomSheetInitialValues,
  sendBottomSheetValidationSchema
} from './send-bottom-sheet.form';

interface Props extends BottomSheetStateProps {
  from: string;
  balance?: string;
}

export const SendBottomSheet: FC<Props> = ({ from, isOpen, onCloseEnd, balance }) => {
  const { send } = useShelter();
  const hdAccounts = useWalletSelector().hdAccounts;

  const onSubmit = (data: SendBottomSheetFormValues) => send(from, data.amount, data.recipient);

  const [selectedAccount, setSelectedAccount] = useState<AccountInterface | undefined>(hdAccounts[0]);
  const handleDropdownValueChange = (item?: AccountInterface) => setSelectedAccount(item);

  return (
    <ModalBottomSheet title="Send" isOpen={isOpen} onCloseEnd={onCloseEnd}>
      <Formik
        initialValues={SendBottomSheetInitialValues}
        validationSchema={sendBottomSheetValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm }) => (
          <>
            <AccountDropdown value={selectedAccount} list={hdAccounts} onValueChange={handleDropdownValueChange} />

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
