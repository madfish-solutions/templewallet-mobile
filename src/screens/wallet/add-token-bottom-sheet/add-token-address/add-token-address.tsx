import React, { FC } from 'react';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { Label } from '../../../../components/label/label';
import { EmptyFn } from '../../../../config/general';
import { FormNumericInput } from '../../../../form/form-numeric-input';
import { FormTextInput } from '../../../../form/form-text-input';

interface Props {
  onNextButtonPress: EmptyFn;
}

export const AddTokenAddress: FC<Props> = ({ onNextButtonPress }) => {
  return (
    <>
      <Label label="Token type" />
      <Label label="Address" description="Address of deployed token contract." />
      <FormTextInput name="address" />

      <Label
        label="Token ID"
        description="A non negative integer number that identifies the token inside FA2 contract"
      />
      <FormNumericInput name="id" />

      <ButtonLargePrimary title="Next" onPress={onNextButtonPress} />
    </>
  );
};
