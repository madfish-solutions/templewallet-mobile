import { Formik } from 'formik';
import React, { FC } from 'react';
import { Button, Text, TouchableOpacity } from 'react-native';

import { BottomSheet, BottomSheetProps } from '../../../components/bottom-sheet/bottom-sheet';
import { EmptyFn } from '../../../config/general';
import { FormNumericInput } from '../../../form/form-numeric-input';
import { FormTextInput } from '../../../form/form-text-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { WalletStyles } from '../wallet.styles';
import {
  SendBottomSheetFormValues,
  SendBottomSheetInitialValues,
  sendBottomSheetValidationSchema
} from './send-bottom-sheet.form';
import { SendBottomSheetStyles } from './send-bottom-sheet.styles';

interface Props extends BottomSheetProps {
  from: string;
  onClose: EmptyFn;
  balance?: string;
}

export const SendBottomSheet: FC<Props> = ({ from, isOpen, onClose, onDismiss, balance }) => {
  const { send } = useShelter();

  const onSubmit = (data: SendBottomSheetFormValues) => send(from, data.amount, data.recipient);

  return (
    <BottomSheet isOpen={isOpen} onDismiss={onDismiss}>
      <Formik
        initialValues={SendBottomSheetInitialValues}
        validationSchema={sendBottomSheetValidationSchema}
        onSubmit={onSubmit}>
        {({ submitForm }) => (
          <>
            <Text style={SendBottomSheetStyles.title}>Send</Text>

            <TouchableOpacity style={WalletStyles.accountItem} onPress={() => null}>
              <Text>Tezos</Text>
              <Text>{balance}</Text>
            </TouchableOpacity>

            <Text>Amount Tezos</Text>
            <FormNumericInput name="amount" />

            <Text>Recipient</Text>
            <FormTextInput name="recipient" />

            <Button title="Cancel" onPress={onClose} />
            <Button title="Send" onPress={submitForm} />
          </>
        )}
      </Formik>
    </BottomSheet>
  );
};
