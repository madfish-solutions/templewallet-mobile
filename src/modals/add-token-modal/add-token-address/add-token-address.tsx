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
import { DeprecatedRadioButton } from '../../../deprecated/deprecated-styled-radio-buttons-group/deprecated-styled-radio-buttons-group';
import { FormAddressInput } from '../../../form/form-address-input';
import { FormNumericInput } from '../../../form/form-numeric-input/form-numeric-input';
import { FormRadioButtonsGroup } from '../../../form/form-radio-buttons-group';
import { TokenTypeEnum } from '../../../interfaces/token-type.enum';
import { loadTokenSuggestionActions } from '../../../store/wallet/wallet-actions';
import { formatSize } from '../../../styles/format-size';
import {
  addTokenAddressFormInitialValues,
  addTokenAddressFormValidationSchema,
  AddTokenAddressFormValues
} from './add-token-address.form';

interface Props {
  onCloseButtonPress: EmptyFn;
  onFormSubmitted: EmptyFn;
}

const typeRadioButtons: DeprecatedRadioButton<TokenTypeEnum>[] = [
  { value: TokenTypeEnum.FA_1_2, label: 'FA 1.2' },
  { value: TokenTypeEnum.FA_2, label: 'FA 2' }
];

export const AddTokenAddress: FC<Props> = ({ onCloseButtonPress, onFormSubmitted }) => {
  const dispatch = useDispatch();

  const onSubmit = ({ id, address }: AddTokenAddressFormValues) => {
    dispatch(loadTokenSuggestionActions.submit({ id: id.toNumber(), address }));
    onFormSubmitted();
  };

  return (
    <Formik
      initialValues={addTokenAddressFormInitialValues}
      validationSchema={addTokenAddressFormValidationSchema}
      onSubmit={onSubmit}>
      {({ values, submitForm, isValid }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Label label="Token type" />
            <FormRadioButtonsGroup name="type" buttons={typeRadioButtons} />

            <Label label="Address" description="Address of deployed token contract." />
            <FormAddressInput name="address" />

            {values.type === TokenTypeEnum.FA_2 && (
              <>
                <Label
                  label="Token ID"
                  description="A non negative integer number that identifies the token inside FA2 contract"
                />
                <FormNumericInput name="id" decimals={0} />
              </>
            )}

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
