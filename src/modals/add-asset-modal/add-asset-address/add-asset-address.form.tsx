import BigNumber from 'bignumber.js';
import { object, SchemaOf } from 'yup';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { evmTokenAddressValidation } from 'src/form/validation/evm-token-address';
import { tokenAddressValidation } from 'src/form/validation/token-address';
import { tokenIdValidation } from 'src/form/validation/token-id';

export interface AddTokenAddressFormValues {
  address: string;
  id?: BigNumber;
}

const tezosValidationSchema: SchemaOf<AddTokenAddressFormValues> = object().shape({
  address: tokenAddressValidation,
  id: tokenIdValidation
});

const evmValidationSchema: SchemaOf<AddTokenAddressFormValues> = object().shape({
  address: evmTokenAddressValidation,
  id: tokenIdValidation
});

export const getAddTokenAddressFormValidationSchema = (network: TempleChainKind) =>
  network === TempleChainKind.Tezos ? tezosValidationSchema : evmValidationSchema;

export const addTokenAddressFormInitialValues: AddTokenAddressFormValues = {
  address: ''
};
