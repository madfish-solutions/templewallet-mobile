import React from 'react';

import { Label } from '../../../components/label/label';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { useGasToken } from '../../../hooks/use-gas-token.hook';

export const TezosTokenInfo = () => {
  const { metadata } = useGasToken();

  return (
    <>
      <Label label="Decimals" description={`Decimals of ${metadata.symbol} token`} />
      <StyledTextInput placeholder={metadata.decimals.toString()} editable={false} />
    </>
  );
};
