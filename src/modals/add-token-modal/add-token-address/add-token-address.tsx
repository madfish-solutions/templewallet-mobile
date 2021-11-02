import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../components/button/buttons-container/buttons-container';
import { Divider } from '../../../components/divider/divider';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { EmptyFn } from '../../../config/general';
import { FormAddressInput } from '../../../form/form-address-input';
import { FormNumericInput } from '../../../form/form-numeric-input/form-numeric-input';
import { useReadOnlyTezosToolkit } from '../../../hooks/use-read-only-tezos-toolkit.hook';
import { loadTokenSuggestionActions } from '../../../store/wallet/wallet-actions';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { showErrorToast, showWarningToast } from '../../../toast/toast.utils';
import { getTokenSlug, isValidTokenContract } from '../../../token/utils/token.utils';
import {
  addTokenAddressFormInitialValues,
  addTokenAddressFormValidationSchema,
  AddTokenAddressFormValues
} from './add-token-address.form';

interface Props {
  onCloseButtonPress: EmptyFn;
  onFormSubmitted: EmptyFn;
}

export const AddTokenAddress: FC<Props> = ({ onCloseButtonPress, onFormSubmitted }) => {
  const dispatch = useDispatch();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);

  const onSubmit = ({ id, address }: AddTokenAddressFormValues) => {
    const token = { address, id: id?.toNumber() ?? 0 };

    tezos.contract
      .at(address)
      .then(contract => {
        if (!isValidTokenContract(contract)) {
          showErrorToast({ description: 'Invalid token address' });
        } else if (selectedAccount.tokensList.find(item => item.slug === getTokenSlug(token)) !== undefined) {
          showErrorToast({ description: 'Token with this address already added to this account.' });
        } else {
          dispatch(loadTokenSuggestionActions.submit(token));
          onFormSubmitted();
        }
      })
      .catch(() => showWarningToast({ description: 'Ooops, something went wrong.\nPlease, try again later.' }));
  };

  return (
    <Formik
      initialValues={addTokenAddressFormInitialValues}
      validationSchema={addTokenAddressFormValidationSchema}
      onSubmit={onSubmit}>
      {({ isValid, submitForm }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Label label="Address" description="Address of deployed token contract." />
            <FormAddressInput name="address" />

            <Label
              label="Token ID"
              description="A non negative integer number that identifies the token inside FA2 contract"
              isOptional={true}
            />
            <FormNumericInput name="id" decimals={0} />

            <Divider />
          </View>

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Close" onPress={onCloseButtonPress} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Next" disabled={!isValid} onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
