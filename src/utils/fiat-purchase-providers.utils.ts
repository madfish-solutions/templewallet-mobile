import { BigNumber } from 'bignumber.js';

import { PaymentProviderInterface } from 'src/interfaces/topup.interface';

import { isDefined } from './is-defined';

const getRangeDistance = (
  { minInputAmount = 0, maxInputAmount = Infinity }: PaymentProviderInterface,
  inputAmount?: BigNumber | number
) => {
  const inputAmountBN = isDefined(inputAmount) ? new BigNumber(inputAmount) : undefined;

  if (!isDefined(inputAmountBN) || (inputAmountBN.gte(minInputAmount) && inputAmountBN.lte(maxInputAmount))) {
    return 0;
  }

  return Math.min(
    inputAmountBN.minus(minInputAmount).abs().toNumber(),
    inputAmountBN.minus(maxInputAmount).abs().toNumber()
  );
};

export const makeFiatPurchaseProvidersSortPredicate =
  (inputAmount?: BigNumber | number) => (providerA: PaymentProviderInterface, providerB: PaymentProviderInterface) => {
    const rangeDistanceA = getRangeDistance(providerA, inputAmount);
    const rangeDistanceB = getRangeDistance(providerB, inputAmount);

    if (rangeDistanceA !== rangeDistanceB) {
      return rangeDistanceA - rangeDistanceB;
    }

    if (providerA.kycRequired !== providerB.kycRequired) {
      return providerA.kycRequired ? -1 : 1;
    }

    const { outputAmount: providerAOutputAmount = 0 } = providerA;
    const { outputAmount: providerBOutputAmount = 0 } = providerB;

    return providerBOutputAmount - providerAOutputAmount;
  };
