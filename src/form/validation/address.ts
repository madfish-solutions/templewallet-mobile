import { validate } from '@temple-wallet/wallet-address-validator';
import { string as stringSchema } from 'yup';

import { AddressValidationErrorEnum } from 'src/enums/address-validation-error.enum';
import { isDefined } from 'src/utils/is-defined';

import { makeRequiredErrorMessage } from './messages';

const otherNetworks = [
  {
    slug: 'trx',
    name: 'Tron',
    errorType: AddressValidationErrorEnum.TRON_NETWORK_ADDRESS
  },
  {
    slug: 'eth',
    name: 'EVM',
    errorType: AddressValidationErrorEnum.EVM_NETWORK_ADDRESS
  }
];
const invalidWalletAddressError = 'Invalid address';

export let addressValidation = stringSchema().required(makeRequiredErrorMessage('Address'));

otherNetworks.forEach(({ slug, name, errorType }) => {
  addressValidation = addressValidation.test(
    errorType,
    `You entered the ${name} network address. Please enter the Tezos network address`,
    value => !isDefined(value) || !validate(value, slug)
  );
});

addressValidation = addressValidation.test(
  AddressValidationErrorEnum.INVALID_ADDRESS,
  invalidWalletAddressError,
  value => !isDefined(value) || validate(value, 'tezos')
);
