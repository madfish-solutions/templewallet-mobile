import { ref, string } from 'yup';

import { makeRequiredErrorMessage } from './messages';

const atLeastOneLowerCaseLetterError = 'At least 1 English lowercase letter';
const atLeastOneUpperCaseLetterError = 'At least 1 English uppercase letter';
const atLeastOneNumberError = 'At least 1 number';
const minError = 'At least 8 English characters';
const onlyAsciiCharsError = 'Only English letters are allowed';

const PASSWORD_PATTERN_ONE_LOWER_CASE = new RegExp('(?=.*[a-z])');
const PASSWORD_PATTERN_ONE_UPPER_CASE = new RegExp('(?=.*[A-Z])');
const PASSWORD_PATTERN_ONE_NUMERIC = new RegExp('(?=.*[0-9])');
const PASSWORD_PATTERN_ONLY_ENGLISH_LETTERS = new RegExp('^[\u0021-\u007e]*$');

export const passwordValidation = string()
  .required(makeRequiredErrorMessage('Password'))
  .min(8, minError)
  .matches(PASSWORD_PATTERN_ONE_LOWER_CASE, atLeastOneLowerCaseLetterError)
  .matches(PASSWORD_PATTERN_ONE_UPPER_CASE, atLeastOneUpperCaseLetterError)
  .matches(PASSWORD_PATTERN_ONE_NUMERIC, atLeastOneNumberError)
  .matches(PASSWORD_PATTERN_ONLY_ENGLISH_LETTERS, onlyAsciiCharsError);

const repeatPasswordError = 'Must be equal to password above';

export const passwordConfirmationValidation = string()
  .required(makeRequiredErrorMessage('Repeat Password'))
  .oneOf([ref('password')], repeatPasswordError);
