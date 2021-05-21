import { number, object, SchemaOf, string } from 'yup';

export type AddTokenInfoFormValues = {
  symbol: string;
  name: string;
  decimals: number;
  iconUrl?: string;
};

export const addTokenInfoFormValidationSchema: SchemaOf<AddTokenInfoFormValues> = object().shape({
  symbol: string().required(),
  name: string().required(),
  decimals: number().required(),
  iconUrl: string()
});
