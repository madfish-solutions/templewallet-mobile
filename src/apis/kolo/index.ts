import { isDefined } from 'src/utils/is-defined';

import { templeWalletApi } from '../../api.service';
import { KOLO_API_PUBLIC_KEY, KOLO_BASE_URL } from '../../utils/env.utils';

interface GetKoloWidgetUrlResponse {
  signedUrl: string;
}

interface KoloWidgetCustomerColors {
  BrandColor?: string;
  ButtonPimary?: string;
  ButtonPimaryDisabled?: string;
  ButtonPimaryPressed?: string;
  TextButton?: string;
  TextDisabledButton?: string;
  BgPrimary?: string;
  BgSecondary?: string;
  BgTertiary?: string;
}

interface GetKoloWidgetUrlParams {
  email?: string;
  isEmailLocked?: boolean;
  themeColor?: 'dark' | 'light';
  currency?: string[];
  language?: string;
  customerColors?: KoloWidgetCustomerColors;
  hideFeatures?: Array<'convert' | 'topup' | 'payout'>;
  isPersist?: boolean;
}

export const getKoloWidgetUrl = async (params: GetKoloWidgetUrlParams = {}): Promise<string> => {
  const { email, isEmailLocked, themeColor, currency, language, customerColors, hideFeatures, isPersist } = params;
  const url = new URL(KOLO_BASE_URL);

  url.searchParams.set('apiKey', KOLO_API_PUBLIC_KEY);

  if (email != null) {
    url.searchParams.set('email', email);
  }

  if (isDefined(isEmailLocked)) {
    url.searchParams.set('isEmailLocked', String(isEmailLocked));
  }

  if (themeColor) {
    url.searchParams.set('themeColor', themeColor);
  }

  currency?.forEach(code => {
    url.searchParams.append('currency', code);
  });

  if (language != null) {
    url.searchParams.set('language', language);
  }

  Object.entries(customerColors ?? {}).forEach(([key, value]) => {
    if (Boolean(value)) {
      url.searchParams.set(key, value);
    }
  });

  hideFeatures?.forEach(feature => {
    url.searchParams.append('hideFeatures', feature);
  });

  if (isDefined(isPersist)) {
    url.searchParams.set('isPersist', String(isPersist));
  }

  const { data } = await templeWalletApi.post<GetKoloWidgetUrlResponse>('/kolo/widget-sign', {
    urlForSignature: url.toString()
  });

  return data.signedUrl;
};
