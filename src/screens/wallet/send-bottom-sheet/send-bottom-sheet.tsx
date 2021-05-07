import { Formik } from 'formik';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AccountFormDropdown } from '../../../components/account-form-dropdown/account-form-dropdown';
import { ModalBottomSheet } from '../../../components/bottom-sheet/modal-bottom-sheet/modal-bottom-sheet';
import { BottomSheetControllerProps } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { step } from '../../../config/styles';
import { FormInputSlider } from '../../../form/form-input-slider';
import { FormNumericInput } from '../../../form/form-numeric-input';
import { FormTextInput } from '../../../form/form-text-input';
import { emptyAccount } from '../../../interfaces/account.interface';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { useWalletSelector } from '../../../store/wallet/wallet-selectors';
import { SendBottomSheetFormValues, sendBottomSheetValidationSchema } from './send-bottom-sheet.form';
import { SendBottomSheetStyles } from './send-bottom-sheet.styles';

interface Props extends BottomSheetControllerProps {
  balance?: string;
}

export const SendBottomSheet: FC<Props> = ({ controller, balance }) => {
  const { send } = useShelter();
  const hdAccounts = useWalletSelector().hdAccounts;

  const SendBottomSheetInitialValues: SendBottomSheetFormValues = {
    account: hdAccounts[0] ?? emptyAccount,
    amount: 0,
    recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne',
    gasFee: 0
  };

  // TODO: integrate gasFee with send request
  const onSubmit = (data: SendBottomSheetFormValues) => send(data.account.publicKeyHash, data.amount, data.recipient);

  return (
    <ModalBottomSheet title="Send" controller={controller}>
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
            <FormNumericInput name="amount" />

            <Text>Recipient</Text>
            <FormTextInput name="recipient" />

            <Text>Gas Fee</Text>
            <FormInputSlider name="gasFee" />

            <View style={SendBottomSheetStyles.buttonsContainer}>
              <ButtonLargeSecondary title="Close" marginRight={2 * step} onPress={controller.close} />
              <ButtonLargePrimary title="Send" onPress={submitForm} />
            </View>
          </>
        )}
      </Formik>
    </ModalBottomSheet>
  );
};
