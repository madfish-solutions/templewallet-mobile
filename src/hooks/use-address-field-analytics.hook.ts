import { FormikContextType } from 'formik';
import { useCallback, useEffect, useRef } from 'react';
import { ValidationError } from 'yup';

import { AddressValidationErrorEnum } from 'src/enums/address-validation-error.enum';
import { addressValidation } from 'src/form/validation/address';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isTezosDomainNameValid } from 'src/utils/dns.utils';
import { isDefined } from 'src/utils/is-defined';

export const useAddressFieldAnalytics = <T extends string, U extends Record<T, string>>(
  addressFromNetworkEventName: string,
  fieldName: T,
  formik: FormikContextType<U>
) => {
  const analytics = useAnalytics();
  const { values } = formik;
  const value = values[fieldName];
  const valueRef = useRef(value);

  const trackNetworkEvent = useCallback(
    (networkSlug?: string) =>
      void analytics.trackEvent(addressFromNetworkEventName, AnalyticsEventCategory.FormChange, {
        network: networkSlug,
        isValidAddress: isDefined(networkSlug)
      }),
    [analytics.trackEvent, addressFromNetworkEventName]
  );

  useEffect(() => {
    const prevValue = valueRef.current;
    valueRef.current = value;

    if ((isDefined(value) && isTezosDomainNameValid(value)) || prevValue === value) {
      return;
    }

    addressValidation
      .validate(value)
      .then(() => trackNetworkEvent('tezos'))
      .catch(e => {
        if (!(e instanceof ValidationError)) {
          return;
        }

        let networkSlug: string | undefined;
        switch (e.type) {
          case AddressValidationErrorEnum.TRON_NETWORK_ADDRESS:
            networkSlug = 'trx';
            break;
          case AddressValidationErrorEnum.EVM_NETWORK_ADDRESS:
            networkSlug = 'evm';
            break;
          case AddressValidationErrorEnum.BTC_NETWORK_ADDRESS:
            networkSlug = 'btc';
            break;
        }

        if (isDefined(networkSlug)) {
          trackNetworkEvent(networkSlug);
        }
      });
  }, [value, trackNetworkEvent]);

  const onBlur = useCallback(async () => {
    const currentValue = valueRef.current;
    if (isDefined(currentValue) && isTezosDomainNameValid(currentValue)) {
      return;
    }

    try {
      await addressValidation.validate(currentValue);
    } catch (e) {
      if (e instanceof ValidationError && e.type === AddressValidationErrorEnum.INVALID_ADDRESS) {
        trackNetworkEvent(undefined);
      }
    }
  }, [trackNetworkEvent]);

  return { onBlur };
};
