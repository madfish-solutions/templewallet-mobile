import { ref, string } from 'yup';
import { requiredErrorMessage } from './shared';

const atLeastOneLowerCaseLetterError = 'At least 1 lowercase letter';
const atLeastOneUpperCaseLetterError = 'At least 1 uppercase letter';
const atLeastOneNumberError = 'At least 1 number';
const minError = 'At least 8 characters';

const PASSWORD_PATTERN_ONE_LOWER_CASE = new RegExp('(?=.*[a-z])');
const PASSWORD_PATTERN_ONE_UPPER_CASE = new RegExp('(?=.*[A-Z])');
const PASSWORD_PATTERN_ONE_NUMERIC = new RegExp('(?=.*[0-9])');

export const passwordValidation = string()
  .required(requiredErrorMessage)
  .matches(PASSWORD_PATTERN_ONE_LOWER_CASE, atLeastOneLowerCaseLetterError)
  .matches(PASSWORD_PATTERN_ONE_UPPER_CASE, atLeastOneUpperCaseLetterError)
  .matches(PASSWORD_PATTERN_ONE_NUMERIC, atLeastOneNumberError)
  .min(8, minError);

const repeatPasswordError = 'Must be equal to password above';

export const passwordConfirmationValidation = string()
  .required(requiredErrorMessage)
  .oneOf([ref('password')], repeatPasswordError);
