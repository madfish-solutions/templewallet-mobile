import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from '../../../../components/buttons-container/buttons-container';
import { Label } from '../../../../components/label/label';
import { EmptyFn } from '../../../../config/general';
import { FormNumericInput } from '../../../../form/form-numeric-input';
import { FormTextInput } from '../../../../form/form-text-input';
import { addTokenMetadataAction } from '../../../../store/wallet/wallet-actions';
import { useAddTokenSuggestion } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { showSuccessToast } from '../../../../toast/toast.utils';
import { addTokenInfoFormValidationSchema, AddTokenInfoFormValues } from './add-token-info.form';

interface Props {
  onCancelButtonPress: EmptyFn;
  onFormSubmitted: EmptyFn;
}

export const AddTokenInfo: FC<Props> = ({ onCancelButtonPress, onFormSubmitted }) => {
  const dispatch = useDispatch();
  const tokenSuggestion = useAddTokenSuggestion();

  const onSubmit = (data: AddTokenInfoFormValues) => {
    dispatch(addTokenMetadataAction({ ...tokenSuggestion, ...data }));
    showSuccessToast('Token successfully added');
    onFormSubmitted();
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={tokenSuggestion}
      validationSchema={addTokenInfoFormValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm, isValid }) => (
        <>
          <Label label="Symbol" description="Token symbol, like ‘USD’ for United States Dollar" />
          <FormTextInput name="symbol" />

          <Label label="Name" description="Token name, like ‘Bitcoin’ for BTC assets." />
          <FormTextInput name="name" />

          <Label
            label="Decimal"
            description="A number of decimal places after point. For example: 8 for BTC, 2 for USD."
          />
          <FormNumericInput name="decimals" />

          <Label label="Icon URL" description="Image URL for token logo." />
          <FormTextInput name="iconUrl" />

          <ButtonsContainer>
            <ButtonLargeSecondary title="Cancel" marginRight={formatSize(16)} onPress={onCancelButtonPress} />
            <ButtonLargePrimary title="Confirm" disabled={!isValid} onPress={submitForm} />
          </ButtonsContainer>
        </>
      )}
    </Formik>
  );
};
