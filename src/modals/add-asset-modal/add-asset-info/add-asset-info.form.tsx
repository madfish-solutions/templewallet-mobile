import BigNumber from 'bignumber.js';
import { object, SchemaOf, string } from 'yup';

import { bigNumberSchema } from 'src/form/validation/big-number';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';

export type AddTokenInfoFormValues = {
  symbol: string;
  name: string;
  decimals: BigNumber;
  thumbnailUri?: string;
};

export const addTokenInfoFormValidationSchema: SchemaOf<AddTokenInfoFormValues> = object().shape({
  symbol: string().required(makeRequiredErrorMessage('Symbol')),
  name: string().required(makeRequiredErrorMessage('Name')),
  decimals: bigNumberSchema()
    .nullable(false)
    .required(makeRequiredErrorMessage('Decimals')) as unknown as SchemaOf<BigNumber>,
  thumbnailUri: string()
});
