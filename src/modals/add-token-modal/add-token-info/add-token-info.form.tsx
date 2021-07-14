import { BigNumber } from 'bignumber.js';
import { object, SchemaOf, string } from 'yup';

import { requiredErrorMessage } from '../../../form/validation/messages';

export type AddTokenInfoFormValues = {
  symbol: string;
  name: string;
  decimals: BigNumber;
  iconUrl?: string;
};

export const addTokenInfoFormValidationSchema: SchemaOf<AddTokenInfoFormValues> = object().shape({
  symbol: string().required(requiredErrorMessage),
  name: string().required(requiredErrorMessage),
  decimals: object().shape({}).nullable(false).required(requiredErrorMessage),
  iconUrl: string()
});
