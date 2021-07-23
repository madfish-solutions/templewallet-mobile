import { string } from 'yup';

import { makeRequiredErrorMessage } from '../../utils/i18n.utils';
import { isDefined } from '../../utils/is-defined';
import { isKTAddress, isValidAddress } from '../../utils/tezos.util';

const invalidAddressError = 'Invalid address';
const invalidKTAddressError = 'Only KT... contract address allowed';

export const tokenAddressValidation = string()
  .required(makeRequiredErrorMessage('Address'))
  .test('is-valid-address', invalidAddressError, value => (isDefined(value) ? isValidAddress(value) : false))
  .test('is-kt-address', invalidKTAddressError, value => (isDefined(value) ? isKTAddress(value) : false));
