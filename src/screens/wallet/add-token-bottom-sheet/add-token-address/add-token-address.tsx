import React, { FC } from 'react';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { Label } from '../../../../components/label/label';
import { EmptyFn } from '../../../../config/general';
import { FormNumericInput } from '../../../../form/form-numeric-input';
import { FormRadioButtonsGroup } from '../../../../form/form-radio-buttons-group';
import { FormTextInput } from '../../../../form/form-text-input';
import { TokenTypeEnum } from '../../../../interfaces/token-type.enum';

interface Props {
  showTokenIdInput: boolean;
  onNextButtonPress: EmptyFn;
}

const typeRadioButtons = [
  { label: 'FA 1.2', value: TokenTypeEnum.FA_1_2 },
  { label: 'FA 2', value: TokenTypeEnum.FA_2 }
];

export const AddTokenAddress: FC<Props> = ({ showTokenIdInput, onNextButtonPress }) => {
  return (
    <>
      <Label label="Token type" />
      <FormRadioButtonsGroup name="type" buttons={typeRadioButtons} />

      <Label label="Address" description="Address of deployed token contract." />
      <FormTextInput name="address" />

      {showTokenIdInput && (
        <>
          <Label
            label="Token ID"
            description="A non negative integer number that identifies the token inside FA2 contract"
          />
          <FormNumericInput name="id" />
        </>
      )}

      <ButtonLargePrimary title="Next" onPress={onNextButtonPress} />
    </>
  );
};
