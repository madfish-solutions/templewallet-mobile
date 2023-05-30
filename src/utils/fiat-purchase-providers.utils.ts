import { BigNumber } from 'bignumber.js';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PaymentProviderInterface } from 'src/interfaces/topup.interface';

import { isDefined } from './is-defined';
import { isTruthy } from './is-truthy';

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
  providersErrors: Partial<Record<TopUpProviderEnum, boolean>>,
  providersLoading: Partial<Record<TopUpProviderEnum, boolean>>,
  inputAmount?: BigNumber | number
) => {
  const shouldFilterByLimits = allProviders.some(
    ({ minInputAmount, maxInputAmount }) => isDefined(minInputAmount) && isDefined(maxInputAmount)
  );
  const shouldFilterByOutputAmount = allProviders.some(
    ({ outputAmount, id }) => isDefined(outputAmount) || providersLoading[id]
  );

  const result = allProviders
    .filter(({ id, minInputAmount, maxInputAmount, outputAmount }) => {
      const isError = Boolean(providersErrors[id]);
      const limitsAreDefined = isDefined(minInputAmount) && isDefined(maxInputAmount);
      const outputAmountIsLegit = isTruthy(outputAmount) && outputAmount > 0;

      return (
        !isError &&
        (!shouldFilterByLimits || limitsAreDefined) &&
        (!shouldFilterByOutputAmount || outputAmountIsLegit || Boolean(providersLoading[id])) &&
        isInRange(minInputAmount, maxInputAmount, inputAmount)
      );
    })
    .sort(fiatPurchaseProvidersSortPredicate);

  if (result.length < 2) {
    return result;
  }

  let bestPriceOptionIndex = 0;
  for (let i = 1; i < result.length; i++) {
    const currentBestOutput = result[bestPriceOptionIndex].outputAmount ?? 0;
    const currentOutput = result[i].outputAmount ?? 0;
    if (currentOutput > currentBestOutput) {
      bestPriceOptionIndex = i;
    }
  }

  return result.map((provider, index) => ({
    ...provider,
    isBestPrice: index === bestPriceOptionIndex
  }));
};
