import { BigNumber } from 'bignumber.js';

import { isDefined } from './is-defined';

export const formatAssetAmount = (
  amount: BigNumber,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
  decimalPlace: number | undefined = undefined
) => {
  return amount
    .decimalPlaces(
      amount.abs().lt(1000) && !isDefined(decimalPlace) ? 6 : isDefined(decimalPlace) ? decimalPlace : 2,
      roundingMode
    )
    .toFixed();
};
