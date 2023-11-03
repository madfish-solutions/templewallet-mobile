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
import { FormNumericInput } from '../../../form/form-numeric-input/form-numeric-input';
import { FormTextInput } from '../../../form/form-text-input';
import { addTokensMetadataAction } from '../../../store/tokens-metadata/tokens-metadata-actions';
import { useAddTokenSuggestionSelector } from '../../../store/tokens-metadata/tokens-metadata-selectors';
import { addTokenAction } from '../../../store/wallet/wallet-actions';
import { formatSize } from '../../../styles/format-size';
import { showSuccessToast } from '../../../toast/toast.utils';

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
    dispatch(addTokensMetadataAction([tokenMetadata]));

    showSuccessToast({ description: 'Token successfully added' });
    onFormSubmitted();
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={addTokenInfoFormValidationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm, isValid }) => (
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

          <View>
            <ButtonsContainer>
              <ButtonLargeSecondary
                title="Back"
                onPress={onCancelButtonPress}
                testID={AddAssetInfoSelectors.backButton}
              />
              <Divider size={formatSize(16)} />
              <ButtonLargePrimary
                title="Confirm"
                disabled={!isValid}
                onPress={submitForm}
                testID={AddAssetInfoSelectors.confirmButton}
              />
            </ButtonsContainer>

            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
