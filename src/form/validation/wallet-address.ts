import { string, ValidationError } from 'yup';

import { isTezosDomainNameValid } from 'src/utils/dns.utils';
import { isDefined } from 'src/utils/is-defined';

import { addressValidation } from './address';
import { makeRequiredErrorMessage } from './messages';

const invalidWalletAddressError = 'Invalid address';

export const walletAddressValidation = string()
  .required(makeRequiredErrorMessage('Address'))
  .test('is-valid-address', invalidWalletAddressError, (value, context) => {
    if (!isDefined(value)) {
      return false;
    }

    if (isTezosDomainNameValid(value)) {
      return true;
    }

    try {
      addressValidation.validateSync(value);

      return true;
    } catch (e) {
      if (e instanceof ValidationError) {
        return new ValidationError(e.errors[0], e.value, context.path, e.type);
      }

      throw e;
    }
  });
