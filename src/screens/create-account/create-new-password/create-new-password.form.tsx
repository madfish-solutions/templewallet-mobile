import { object, SchemaOf } from 'yup';

import { acceptTermsValidation } from '../../../form/validation/accept-terms';
import { passwordConfirmationValidation, passwordValidation } from '../../../form/validation/password';

export type CreateNewPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
  acceptTerms: boolean;
};

export const createNewPasswordValidationSchema: SchemaOf<CreateNewPasswordFormValues> = object().shape({
  password: passwordValidation,
  passwordConfirmation: passwordConfirmationValidation,
  acceptTerms: acceptTermsValidation
});

export const createNewPasswordInitialValues: CreateNewPasswordFormValues = {
  password: '',
  passwordConfirmation: '',
  acceptTerms: false
};
