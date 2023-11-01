import { string } from 'yup';

import { isDefined } from '../../utils/is-defined';
import { isKTAddress, isValidAddress } from '../../utils/tezos.util';

import { makeRequiredErrorMessage } from './messages';

const invalidAddressError = 'Invalid address';
const invalidKTAddressError = 'Only KT... contract address allowed';

export const tokenAddressValidation = string()
  .required(makeRequiredErrorMessage('Address'))
  .test('is-kt-address', invalidKTAddressError, value => (isDefined(value) ? isKTAddress(value) : false))
  .test('is-valid-address', invalidAddressError, value => (isDefined(value) ? isValidAddress(value) : false));
