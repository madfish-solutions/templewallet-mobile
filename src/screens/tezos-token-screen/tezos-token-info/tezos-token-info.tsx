import React from 'react';

import { Label } from '../../../components/label/label';
import { StyledTextInput } from '../../../components/styled-text-input/styled-text-input';
import { XTZ_TOKEN_METADATA } from '../../../token/data/tokens-metadata';

export const TezosTokenInfo = () => {
  const symbol = XTZ_TOKEN_METADATA.symbol;

  return (
    <>
      <Label label="Decimals" description={`Decimals of ${symbol} token`} />
      <StyledTextInput placeholder={XTZ_TOKEN_METADATA.decimals.toString()} editable={false} />
    </>
  );
};
