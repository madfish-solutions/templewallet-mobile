import { mixed, object, SchemaOf } from 'yup';

import { tokenAddressValidation } from '../../../../form/validation/token-address';
import { tokenIdValidation } from '../../../../form/validation/token-id';
import { TokenTypeEnum } from '../../../../interfaces/token-type.enum';

export type AddTokenAddressFormValues = {
  type: TokenTypeEnum;
  address: string;
  id: number;
};

export const addTokenAddressFormValidationSchema: SchemaOf<AddTokenAddressFormValues> = object().shape({
  type: mixed<TokenTypeEnum>().oneOf(Object.values(TokenTypeEnum)).required(),
  address: tokenAddressValidation,
  id: tokenIdValidation
});

export const addTokenAddressFormInitialValues: AddTokenAddressFormValues = {
  type: TokenTypeEnum.FA_2,
  address: '',
  id: 0
};
