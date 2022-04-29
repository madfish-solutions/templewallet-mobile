import { object, SchemaOf } from 'yup';

import { acceptTermsValidation } from '../../../../form/validation/accept-terms';
import { analyticsValidation } from '../../../../form/validation/analytics';
import { passwordValidation } from '../../../../form/validation/password';
import { useBiometryValidation } from '../../../../form/validation/use-biometry';
import { usePrevPasswordValidation } from '../../../../form/validation/use-previous-password';

export type ConfirmSyncFormValues = {
  password: string;
  useBiometry?: boolean;
  usePrevPassword?: boolean;
  acceptTerms: boolean;
  analytics: boolean;
};

export const ConfirmSyncValidationSchema: SchemaOf<ConfirmSyncFormValues> = object().shape({
  password: passwordValidation,
  useBiometry: useBiometryValidation,
  usePrevPassword: usePrevPasswordValidation,
  acceptTerms: acceptTermsValidation,
  analytics: analyticsValidation
});
