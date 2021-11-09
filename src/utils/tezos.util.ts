import { validateAddress, ValidationResult } from '@taquito/utils';
import { BigNumber } from 'bignumber.js';

import { isDefined } from './is-defined';

export const mutezToTz = (bigNum: BigNumber | undefined, decimals: number) => {
  if (!isDefined(bigNum)) {
    return undefined;
  }
  if (bigNum.isNaN()) {
    return bigNum;
  }

  return bigNum.integerValue().div(new BigNumber(10).pow(decimals));
};

export const tzToMutez = (bigNum: BigNumber | undefined, decimals: number) => {
  if (!isDefined(bigNum)) {
    return undefined;
  }
  if (bigNum.isNaN()) {
    return bigNum;
  }

  return bigNum?.decimalPlaces(decimals).times(new BigNumber(10).pow(decimals));
};

export const isValidAddress = (address: string) => validateAddress(address) === ValidationResult.VALID;

export const isKTAddress = (address: string) => address.startsWith('KT');
