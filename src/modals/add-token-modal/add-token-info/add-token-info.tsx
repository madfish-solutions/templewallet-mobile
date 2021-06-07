import { BigNumber } from 'bignumber.js';
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
import { FormNumericInput } from '../../../form/form-numeric-input';
import { FormTextInput } from '../../../form/form-text-input';
import { addTokenMetadataAction } from '../../../store/wallet/wallet-actions';
import { useAddTokenSuggestion } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { showSuccessToast } from '../../../toast/toast.utils';
import { addTokenInfoFormValidationSchema, AddTokenInfoFormValues } from './add-token-info.form';

interface Props {
  onCancelButtonPress: EmptyFn;
  onFormSubmitted: EmptyFn;
}

export const AddTokenInfo: FC<Props> = ({ onCancelButtonPress, onFormSubmitted }) => {
  const dispatch = useDispatch();
  const tokenSuggestion = useAddTokenSuggestion();
  const initialValues = {
    ...tokenSuggestion,
    decimals: new BigNumber(tokenSuggestion.decimals)
  };

  const onSubmit = (data: AddTokenInfoFormValues) => {
    const tokenMetadata = { ...initialValues, ...data };
    dispatch(addTokenMetadataAction({ ...tokenMetadata, decimals: tokenMetadata.decimals.toNumber() }));
    showSuccessToast('Token successfully added');
    onFormSubmitted();
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={addTokenInfoFormValidationSchema}
      onSubmit={onSubmit}>
      {({ submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Label label="Symbol" description="Token symbol, like ‘USD’ for United States Dollar" />
            <FormTextInput name="symbol" />

            <Label label="Name" description="Token name, like ‘Bitcoin’ for BTC assets." />
            <FormTextInput name="name" />

            <Label
              label="Decimal"
              description="A number of decimal places after point. For example: 8 for BTC, 2 for USD."
            />
            <FormNumericInput name="decimals" decimals={0} />

            <Label label="Icon URL" description="Image URL for token logo." />
            <FormTextInput name="iconUrl" />

            <Divider />
          </View>

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary title="Cancel" onPress={onCancelButtonPress} />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary title="Confirm" disabled={!isValid} onPress={submitForm} />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
