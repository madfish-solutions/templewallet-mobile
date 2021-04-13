import { string } from 'yup';
import { requiredErrorMessage } from './shared';

const passwordError =
  'At least 8 characters\n' + 'At least 1 number\n' + 'At least 1 lowercase letter\n' + 'At least 1 uppercase letter';
const PASSWORD_PATTERN = new RegExp(
  [
    '^',
    '(?=.*[a-z])', // Must contain at least 1 lowercase alphabetical character
    '(?=.*[A-Z])', // Must contain at least 1 uppercase alphabetical character
    '(?=.*[0-9])', // Must contain at least 1 numeric character
    '(?=.{8,})' // Must be eight characters or longer
  ].join('')
);

const passwordValidation = string().required(requiredErrorMessage).matches(PASSWORD_PATTERN, passwordError);

export default passwordValidation;
