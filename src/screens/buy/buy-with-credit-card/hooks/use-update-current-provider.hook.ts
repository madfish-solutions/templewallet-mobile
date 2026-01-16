import { isEqual } from 'lodash-es';
import { useEffect, RefObject } from 'react';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PaymentProviderInterface } from 'src/interfaces/payment-provider';
import { isDefined } from 'src/utils/is-defined';

export const useUpdateCurrentProvider = (
  paymentProvidersToDisplay: PaymentProviderInterface[],
  topUpProvider: PaymentProviderInterface | undefined,
  manuallySelectedProviderIdRef: RefObject<TopUpProviderEnum | undefined>,
  setProvider: (provider: PaymentProviderInterface | undefined) => void,
  isLoading: boolean
) => {
  useEffect(() => {
    if (isLoading) {
      return;
    }

    const manuallySelectedProviderId = manuallySelectedProviderIdRef.current;
    const manuallySelectedProvider = paymentProvidersToDisplay.find(p => p.id === manuallySelectedProviderId);
    // We discard manually selected provider, as soon as it becomes absent in the list
    if (!isDefined(manuallySelectedProvider)) {
      manuallySelectedProviderIdRef.current = undefined;
    }

    // No multiple choice
    if (paymentProvidersToDisplay.length < 2) {
      const newPaymentProvider = paymentProvidersToDisplay[0];
      if (!isEqual(newPaymentProvider, topUpProvider)) {
        setProvider(newPaymentProvider);
      }

      return;
    }

    // Manual
    if (isDefined(manuallySelectedProvider)) {
      if (!isEqual(manuallySelectedProvider, topUpProvider)) {
        setProvider(manuallySelectedProvider);
      }

      return;
    }

    const newPaymentProvider = paymentProvidersToDisplay[0];
    if (!isEqual(newPaymentProvider, topUpProvider)) {
      setProvider(newPaymentProvider);
    }
  }, [paymentProvidersToDisplay, topUpProvider, setProvider, isLoading]);
};
