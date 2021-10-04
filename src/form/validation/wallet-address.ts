import { string } from 'yup';

import { isTezosDomainNameValid } from '../../utils/dns.utils';
import { isDefined } from '../../utils/is-defined';
import { isValidAddress } from '../../utils/tezos.util';
import { makeRequiredErrorMessage } from './messages';

const invalidWalletAddressError = 'Invalid address';

export const walletAddressValidation = string()
  .required(makeRequiredErrorMessage('Address'))
  .test('is-valid-address', invalidWalletAddressError, value =>
    isDefined(value) ? isValidAddress(value) || isTezosDomainNameValid(value) : false
  );
