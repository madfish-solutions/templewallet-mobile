import React, { FC } from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Label } from '../../../../components/label/label';
import { EmptyFn } from '../../../../config/general';
import { FormNumericInput } from '../../../../form/form-numeric-input';
import { FormTextInput } from '../../../../form/form-text-input';
import { formatSize } from '../../../../styles/format-size';
import { AddTokenInfoStyles } from './add-token-info.styles';

interface Props {
  isValid: boolean;
  onCancelButtonPress: EmptyFn;
  onConfirmButtonPress: EmptyFn;
}

export const AddTokenInfo: FC<Props> = ({ isValid, onCancelButtonPress, onConfirmButtonPress }) => {
  return (
    <>
      <Label label="Symbol" description="Token symbol, like ‘USD’ for United States Dollar" />
      <FormTextInput name="symbol" />

      <Label label="Name" description="Token name, like ‘Bitcoin’ for BTC assets." />
      <FormTextInput name="name" />

      <Label label="Decimal" description="A number of decimal places after point. For example: 8 for BTC, 2 for USD." />
      <FormNumericInput name="decimal" />

      <Label label="Icon URL" description="Image URL for token logo." />
      <FormTextInput name="iconUrl" />

      <View style={AddTokenInfoStyles.buttonsContainer}>
        <ButtonLargeSecondary title="Cancel" marginRight={formatSize(16)} onPress={onCancelButtonPress} />
        <ButtonLargePrimary title="Confirm" disabled={!isValid} onPress={onConfirmButtonPress} />
      </View>
    </>
  );
};
