import { BigNumber } from 'bignumber.js';
import { object, SchemaOf, string } from 'yup';

export type AddTokenInfoFormValues = {
  symbol: string;
  name: string;
  decimals: BigNumber;
  iconUrl?: string;
};

export const addTokenInfoFormValidationSchema: SchemaOf<AddTokenInfoFormValues> = object().shape({
  symbol: string().required(),
  name: string().required(),
  decimals: object().shape({}).nullable(false).required(),
  iconUrl: string()
});
