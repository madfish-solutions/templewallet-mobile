import { mixed, number, object, SchemaOf, string } from 'yup';

import { TokenTypeEnum } from '../../../interfaces/token-type.enum';

export type AddTokenFormValues = {
  type: TokenTypeEnum;
  address: string;
  id?: number;
  symbol: string;
  name: string;
  decimal: number;
  iconUrl?: string;
};

export const addTokenFormValidationSchema: SchemaOf<AddTokenFormValues> = object().shape({
  type: mixed<TokenTypeEnum>().oneOf(Object.values(TokenTypeEnum)).required(),
  address: string().required(),
  id: number().when('type', {
    is: (type: TokenTypeEnum) => type === TokenTypeEnum.FA_2,
    then: number().required()
  }),
  symbol: string().required(),
  name: string().required(),
  decimal: number().required(),
  iconUrl: string()
});

export const addTokenFormInitialValues: AddTokenFormValues = {
  type: TokenTypeEnum.FA_2,
  address: '',
  id: 0,
  symbol: '',
  name: '',
  decimal: 0
};
