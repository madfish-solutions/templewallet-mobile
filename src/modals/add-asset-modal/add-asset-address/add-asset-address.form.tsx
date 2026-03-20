import BigNumber from 'bignumber.js';
import { object, SchemaOf } from 'yup';

import { tokenAddressValidation } from 'src/form/validation/token-address';
import { tokenIdValidation } from 'src/form/validation/token-id';

export interface AddTokenAddressFormValues {
  address: string;
  id?: BigNumber;
}

export const addTokenAddressFormValidationSchema: SchemaOf<AddTokenAddressFormValues> = object().shape({
  address: tokenAddressValidation,
  id: tokenIdValidation
});

export const addTokenAddressFormInitialValues: AddTokenAddressFormValues = {
  address: ''
};
