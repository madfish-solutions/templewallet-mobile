import { BigNumber } from 'bignumber.js';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { ProviderErrors } from 'src/interfaces/buy-with-card';
import { PaymentProviderInterface } from 'src/interfaces/payment-provider';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { isPositiveNumber } from 'src/utils/number.util';

const isInRange = (min = 0, max = Infinity, inputAmount?: BigNumber | number) => {
  const inputAmountBN = isDefined(inputAmount) ? new BigNumber(inputAmount) : undefined;

  return !isDefined(inputAmountBN) || (inputAmountBN.gte(min) && inputAmountBN.lte(max));
};

const fiatPurchaseProvidersSortPredicate = (
  providerA: PaymentProviderInterface,
  providerB: PaymentProviderInterface
) => {
  if (providerA.kycRequired !== providerB.kycRequired) {
    return providerA.kycRequired ? -1 : 1;
  }

  const { outputAmount: providerAOutputAmount = 0 } = providerA;
  const { outputAmount: providerBOutputAmount = 0 } = providerB;

  return providerBOutputAmount - providerAOutputAmount;
};

export const getPaymentProvidersToDisplay = (
  allProviders: PaymentProviderInterface[],
  providersErrors: Partial<Record<TopUpProviderEnum, ProviderErrors>>,
  providersLoading: Partial<Record<TopUpProviderEnum, boolean>>,
  inputAmount?: BigNumber | number
) => {
  const filtered = filterPaymentProviders(allProviders, providersErrors, providersLoading, inputAmount);

  if (filtered.length < 2) {
    return filtered;
  }

  const sorted = filtered.sort(fiatPurchaseProvidersSortPredicate);

  return sorted.map((provider, index) => ({
    ...provider,
    isBestPrice: index === 0 && isPositiveNumber(provider.outputAmount)
  }));
};

const filterPaymentProviders = (
  allProviders: PaymentProviderInterface[],
  providersErrors: Partial<Record<TopUpProviderEnum, ProviderErrors>>,
  providersLoading: Partial<Record<TopUpProviderEnum, boolean>>,
  inputAmount?: BigNumber | number
) => {
  const shouldFilterByLimitsDefined = allProviders.some(
    ({ minInputAmount, maxInputAmount }) => isDefined(minInputAmount) && isDefined(maxInputAmount)
  );
  const shouldFilterByOutputAmount = allProviders.some(
    ({ outputAmount, id }) => isDefined(outputAmount) || providersLoading[id]
  );

  return allProviders.filter(({ id, minInputAmount, maxInputAmount, outputAmount }) => {
    const errors = providersErrors[id];
    if (isDefined(errors)) {
      if (isDefined(errors.currencies) || isDefined(errors.limits) || errors.output === true) {
        return false;
      }
    }

    const limitsAreDefined = isDefined(minInputAmount) && isDefined(maxInputAmount);
    const outputAmountIsLegit = isTruthy(outputAmount) && outputAmount > 0;

    return (
      (!shouldFilterByLimitsDefined || limitsAreDefined) &&
      (!shouldFilterByOutputAmount || outputAmountIsLegit || Boolean(providersLoading[id])) &&
      isInRange(minInputAmount, maxInputAmount, inputAmount)
    );
  });
};
