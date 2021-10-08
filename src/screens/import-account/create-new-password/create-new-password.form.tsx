import { object, SchemaOf } from 'yup';

import { acceptTermsValidation } from '../../../form/validation/accept-terms';
import { passwordConfirmationValidation, passwordValidation } from '../../../form/validation/password';
import { useBiometryValidation } from '../../../form/validation/use-biometry';

export type CreateNewPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
  useBiometry?: boolean;
  acceptTerms: boolean;
};

export const createNewPasswordValidationSchema: SchemaOf<CreateNewPasswordFormValues> = object().shape({
  password: passwordValidation,
  passwordConfirmation: passwordConfirmationValidation,
  useBiometry: useBiometryValidation,
  acceptTerms: acceptTermsValidation
});
