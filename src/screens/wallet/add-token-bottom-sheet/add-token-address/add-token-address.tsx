import { Formik } from 'formik';
import React, { FC } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../../../components/buttons-container/buttons-container';
import { Divider } from '../../../../components/divider/divider';
import { Label } from '../../../../components/label/label';
import { RadioButton } from '../../../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { EmptyFn } from '../../../../config/general';
import { FormNumericInput } from '../../../../form/form-numeric-input';
import { FormRadioButtonsGroup } from '../../../../form/form-radio-buttons-group';
import { FormTextInput } from '../../../../form/form-text-input';
import { TokenTypeEnum } from '../../../../interfaces/token-type.enum';
import { loadTokenMetadataActions } from '../../../../store/wallet/wallet-actions';
import { formatSize } from '../../../../styles/format-size';
import {
  addTokenAddressFormInitialValues,
  addTokenAddressFormValidationSchema,
  AddTokenAddressFormValues
} from './add-token-address.form';

interface Props {
  onFormSubmitted: EmptyFn;
}

const typeRadioButtons: RadioButton<TokenTypeEnum>[] = [
  { value: TokenTypeEnum.FA_1_2, label: 'FA 1.2' },
  { value: TokenTypeEnum.FA_2, label: 'FA 2' }
];

export const AddTokenAddress: FC<Props> = ({ onFormSubmitted }) => {
  const dispatch = useDispatch();

  const onSubmit = ({ id, address }: AddTokenAddressFormValues) => {
    dispatch(loadTokenMetadataActions.submit({ id, address }));
    onFormSubmitted();
  };

  return (
    <Formik
      initialValues={addTokenAddressFormInitialValues}
      validationSchema={addTokenAddressFormValidationSchema}
      onSubmit={onSubmit}>
      {({ values, submitForm, isValid }) => (
        <>
          <View>
            <Label label="Token type" />
            <FormRadioButtonsGroup name="type" buttons={typeRadioButtons} />

          <Label label="Address" description="Address of deployed token contract." />
          <FormTextInput name="address" />

          {values.type === TokenTypeEnum.FA_2 && (
            <>
              <Label
                label="Token ID"
                description="A non negative integer number that identifies the token inside FA2 contract"
              />
              <FormNumericInput name="id" />
            </>
          )}

          <Divider height={formatSize(16)} />

          <ButtonsContainer>
            <ButtonLargePrimary title="Next" disabled={!isValid} onPress={submitForm} />
          </ButtonsContainer>
        </>
      )}
    </Formik>
  );
};
