import { object, SchemaOf } from 'yup';

import { acceptTermsValidation } from 'src/form/validation/accept-terms';
import { analyticsValidation } from 'src/form/validation/analytics';
import { passwordValidation } from 'src/form/validation/password';
import { useBiometryValidation } from 'src/form/validation/use-biometry';
import { usePrevPasswordValidation } from 'src/form/validation/use-previous-password';
import { viewAdsValidation } from 'src/form/validation/view-ads';

export type ConfirmSyncFormValues = {
  password: string;
  useBiometry?: boolean;
  usePrevPassword?: boolean;
  acceptTerms: boolean;
  analytics: boolean;
  viewAds: boolean;
};

export const ConfirmSyncValidationSchema: SchemaOf<ConfirmSyncFormValues> = object().shape({
  password: passwordValidation,
  useBiometry: useBiometryValidation,
  usePrevPassword: usePrevPasswordValidation,
  acceptTerms: acceptTermsValidation,
  analytics: analyticsValidation,
  viewAds: viewAdsValidation
});

export const ConfirmSyncInitialValues: ConfirmSyncFormValues = {
  password: '',
  acceptTerms: false,
  analytics: true,
  viewAds: true
};
