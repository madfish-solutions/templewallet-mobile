import { object, SchemaOf } from 'yup';
import { passwordValidation } from '../../form/validation/password';
import { passwordConfirmationValidation } from '../../form/validation/password-confirmation';
import { acceptTermsValidation } from '../../form/validation/accept-terms';

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
