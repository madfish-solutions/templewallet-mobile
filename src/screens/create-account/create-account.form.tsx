import { object, SchemaOf } from 'yup';

import { acceptTermsValidation } from '../../form/validation/accept-terms';
import { passwordConfirmationValidation, passwordValidation } from '../../form/validation/password';

export type CreateAccountFormValues = {
  password: string;
  passwordConfirmation: string;
  acceptTerms: boolean;
};

export const createAccountValidationSchema: SchemaOf<CreateAccountFormValues> = object().shape({
  password: passwordValidation,
  passwordConfirmation: passwordConfirmationValidation,
  acceptTerms: acceptTermsValidation
});

export const createAccountInitialValues: CreateAccountFormValues = {
  password: '',
  passwordConfirmation: '',
  acceptTerms: false
};
