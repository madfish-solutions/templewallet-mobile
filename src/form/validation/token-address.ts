import { string } from 'yup';

import { isDefined } from 'src/utils/is-defined';
import { isKTAddress, isValidAddress } from 'src/utils/tezos.util';

import { getAddressNetwork, getWrongNetworkAddressError } from './address';
import { makeRequiredErrorMessage } from './messages';

const invalidAddressError = 'Invalid address';
const invalidKTAddressError = 'Only KT... contract address allowed';

export const tokenAddressValidation = string()
  .required(makeRequiredErrorMessage('Address'))
  .test('is-kt-address', invalidKTAddressError, function (value) {
    if (!isDefined(value)) {
      return false;
    }

    if (isKTAddress(value)) {
      return true;
    }

    const enteredNetwork = getAddressNetwork(value);

    return isDefined(enteredNetwork) && enteredNetwork !== 'Sapling' && enteredNetwork !== 'Tezos'
      ? this.createError({ message: getWrongNetworkAddressError(value, 'Tezos') })
      : false;
  })
  .test('is-valid-address', invalidAddressError, value => (isDefined(value) ? isValidAddress(value) : false));
