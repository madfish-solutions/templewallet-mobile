import { validateAddress, ValidationResult } from '@taquito/utils';
import { BigNumber } from 'bignumber.js';

export const mutezToTz = (bigNum: BigNumber, decimals: number) => {
  if (bigNum.isNaN()) {
    return bigNum;
  }

  return bigNum.integerValue().div(new BigNumber(10).pow(decimals));
};

export const tzToMutez = (bigNum: BigNumber, decimals: number) =>
  bigNum.decimalPlaces(decimals).times(new BigNumber(10).pow(decimals));

export const isValidAddress = (address: string) => validateAddress(address) === ValidationResult.VALID;

export const isKTAddress = (address: string) => isValidAddress(address) && address.startsWith('KT');
