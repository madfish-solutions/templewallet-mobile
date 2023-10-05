import { object, SchemaOf } from 'yup';

import { viewAdsValidation } from 'src/form/validation/view-ads';

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
