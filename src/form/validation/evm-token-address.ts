import { isAddress } from 'viem';
import { string } from 'yup';

import { isDefined } from 'src/utils/is-defined';

import { getWrongNetworkAddressError } from './address';
import { makeRequiredErrorMessage } from './messages';

export const evmTokenAddressValidation = string()
  .required(makeRequiredErrorMessage('Address'))
  .test('is-evm-address', 'Invalid address', function (value) {
    if (!isDefined(value)) {
      return false;
    }

    if (isAddress(value)) {
      return true;
    }

    const wrongNetworkError = getWrongNetworkAddressError(value, 'EVM');

    return isDefined(wrongNetworkError) ? this.createError({ message: wrongNetworkError }) : false;
  });
