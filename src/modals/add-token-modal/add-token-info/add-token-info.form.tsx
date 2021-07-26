import { BigNumber } from 'bignumber.js';
import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../../form/validation/messages';

export type AddTokenInfoFormValues = {
  symbol: string;
  name: string;
  decimals: BigNumber;
  iconUrl?: string;
};

export const addTokenInfoFormValidationSchema: SchemaOf<AddTokenInfoFormValues> = object().shape({
  symbol: string().required(makeRequiredErrorMessage('Symbol')),
  name: string().required(makeRequiredErrorMessage('Name')),
  decimals: object().shape({}).nullable(false).required(makeRequiredErrorMessage('Decimals')),
  iconUrl: string()
});
