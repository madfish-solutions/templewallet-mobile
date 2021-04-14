import { ref, string } from 'yup';
import { requiredErrorMessage } from './shared';

const repeatPasswordError = 'Must be equal to password above';

export const passwordConfirmationValidation = string()
  .required(requiredErrorMessage)
  .oneOf([ref('password')], repeatPasswordError);
