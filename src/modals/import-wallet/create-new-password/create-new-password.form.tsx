import { object, SchemaOf } from 'yup';

import { viewAdsValidation } from 'src/form/validation/view-ads';

import { acceptTermsValidation } from '../../../form/validation/accept-terms';
import { analyticsValidation } from '../../../form/validation/analytics';
import { passwordConfirmationValidation, passwordValidation } from '../../../form/validation/password';
import { useBiometryValidation } from '../../../form/validation/use-biometry';

export type CreateNewPasswordFormValues = {
  password: string;
  passwordConfirmation: string;
  useBiometry?: boolean;
  acceptTerms: boolean;
  analytics: boolean;
  viewAds: boolean;
};

export const createNewPasswordValidationSchema: SchemaOf<CreateNewPasswordFormValues> = object().shape({
  password: passwordValidation,
  passwordConfirmation: passwordConfirmationValidation,
  useBiometry: useBiometryValidation,
  acceptTerms: acceptTermsValidation,
  analytics: analyticsValidation,
  viewAds: viewAdsValidation
});
