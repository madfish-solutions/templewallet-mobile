import { BigNumber } from 'bignumber.js';
import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormNumericInput } from 'src/form/form-numeric-input/form-numeric-input';
import { FormTextInput } from 'src/form/form-text-input';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { putTokenMetadataAction } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useAddTokenSuggestionSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { addTokenAction } from 'src/store/wallet/wallet-actions';
import { showSuccessToast } from 'src/toast/toast.utils';

import { addTokenInfoFormValidationSchema, AddTokenInfoFormValues } from './add-asset-info.form';
import { AddAssetInfoSelectors } from './add-asset-info.selectors';

interface Props {
  onCancelButtonPress: EmptyFn;
  onFormSubmitted: EmptyFn;
}

export const AddAssetInfo: FC<Props> = ({ onCancelButtonPress, onFormSubmitted }) => {
  const dispatch = useDispatch();
  const tokenSuggestion = useAddTokenSuggestionSelector();
  const initialValues = {
    ...tokenSuggestion.data,
    decimals: new BigNumber(tokenSuggestion.data.decimals)
  };

  const onSubmit = (data: AddTokenInfoFormValues) => {
    const tokenMetadata = { ...initialValues, ...data, decimals: data.decimals.toNumber() };

    dispatch(addTokenAction(tokenMetadata));
    dispatch(putTokenMetadataAction(tokenMetadata));

    showSuccessToast({ description: 'Token successfully added' });
    onFormSubmitted();
  };

  return (
    <Formik
      enableReinitialize={true} // (!) Might lead to unwanted form resets.
      initialValues={initialValues}
      validationSchema={addTokenInfoFormValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm, isValid }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Label label="Symbol" description="Token symbol, like ‘USD’ for United States Dollar" />
              <FormTextInput name="symbol" testID={AddAssetInfoSelectors.symbolInput} />

              <Label label="Name" description="Token name, like ‘Bitcoin’ for BTC assets." />
              <FormTextInput name="name" testID={AddAssetInfoSelectors.nameInput} />

              <Label
                label="Decimals"
                description="A number of decimal places after point. For example: 8 for BTC, 2 for USD."
              />
              <FormNumericInput name="decimals" decimals={0} testID={AddAssetInfoSelectors.decimalsInput} />

              <Label label="Icon URL" description="Image URL for token logo." isOptional={true} />
              <FormTextInput name="thumbnailUri" testID={AddAssetInfoSelectors.iconUrlInput} />

              <Divider />
            </View>
          </ScreenContainer>

          <ModalButtonsFloatingContainer>
            <ButtonLargeSecondary
              title="Back"
              onPress={onCancelButtonPress}
              testID={AddAssetInfoSelectors.backButton}
            />
            <ButtonLargePrimary
              title="Confirm"
              disabled={!isValid}
              onPress={submitForm}
              testID={AddAssetInfoSelectors.confirmButton}
            />
          </ModalButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
