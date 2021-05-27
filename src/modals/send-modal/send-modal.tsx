import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';

import { AccountFormDropdown } from '../../components/account-dropdown/account-form-dropdown';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { FormInputSlider } from '../../form/form-input-slider';
import { FormNumericInput } from '../../form/form-numeric-input';
import { FormTextInput } from '../../form/form-text-input';
import { useNavigation } from '../../navigator/use-navigation.hook';
import { useShelter } from '../../shelter/use-shelter.hook';
import { useHdAccountsListSelector, useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

export const SendModal: FC = () => {
  const { send } = useShelter();
  const { goBack } = useNavigation();
  const hdAccounts = useHdAccountsListSelector();
  const selectedAccount = useSelectedAccountSelector();

  const SendBottomSheetInitialValues: SendModalFormValues = {
    account: selectedAccount,
    amount: 0,
    recipient: 'tz1L21Z9GWpyh1FgLRKew9CmF17AxQJZFfne',
    gasFee: 0
  };

  // TODO: integrate gasFee with send request
  const onSubmit = (data: SendModalFormValues) => send(data.account.publicKeyHash, data.amount, data.recipient);

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
            <FormNumericInput name="amount" />
            <Divider />

            <Label label="Fee" />
            <FormInputSlider name="gasFee" />

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
