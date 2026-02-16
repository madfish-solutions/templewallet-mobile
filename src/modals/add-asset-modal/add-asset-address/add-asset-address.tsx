import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormAddressInput } from 'src/form/form-address-input';
import { FormNumericInput } from 'src/form/form-numeric-input/form-numeric-input';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { loadTokenSuggestionActions } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useCurrentAccountStoredAssetsListSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast, showWarningToast } from 'src/toast/toast.utils';
import { getTokenSlug, isValidTokenContract } from 'src/token/utils/token.utils';

import {
  addTokenAddressFormInitialValues,
  addTokenAddressFormValidationSchema,
  AddTokenAddressFormValues
} from './add-asset-address.form';
import { AddAssetAddressSelectors } from './add-asset-address.selectors';

interface Props {
  onCloseButtonPress: EmptyFn;
  onFormSubmitted: EmptyFn;
}

export const AddAssetAddress: FC<Props> = ({ onCloseButtonPress, onFormSubmitted }) => {
  const dispatch = useDispatch();
  const tezos = useReadOnlyTezosToolkit();

  const assets = useCurrentAccountStoredAssetsListSelector();

  const onSubmit = ({ id, address }: AddTokenAddressFormValues) => {
    const token = { address, id: id?.toNumber() ?? 0 };
    const slug = getTokenSlug(token);

    tezos.contract
      .at(address)
      .then(contract => {
        if (!isValidTokenContract(contract)) {
          showErrorToast({ description: 'Invalid token address' });
        } else if (assets?.some(item => item.slug === slug)) {
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
      onSubmit={onSubmit}
    >
      {({ isValid, submitForm }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Label label="Address" description="Address of deployed token contract." />
              <FormAddressInput name="address" testID={AddAssetAddressSelectors.addressInput} />

              <Label
                label="Token ID"
                description="A non negative integer number that identifies the token inside FA2 contract"
                isOptional={true}
              />
              <FormNumericInput name="id" decimals={0} testID={AddAssetAddressSelectors.tokenIdInput} />

              <Divider />
            </View>
          </ScreenContainer>
          <ModalButtonsFloatingContainer>
            <ButtonLargeSecondary
              title="Close"
              onPress={onCloseButtonPress}
              testID={AddAssetAddressSelectors.closeButton}
            />
            <ButtonLargePrimary
              title="Next"
              disabled={!isValid}
              onPress={submitForm}
              testID={AddAssetAddressSelectors.nextButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
