import { validateAddress, ValidationResult } from '@taquito/utils';
import { BigNumber } from 'bignumber.js';

export const mutezToTz = (bigNum: BigNumber, decimals: number) => {
  if (bigNum.isNaN()) {
    return bigNum;
  }

  return bigNum.integerValue().div(10 ** decimals);
};

export const isValidAddress = (address: string) => validateAddress(address) === ValidationResult.VALID;

export const isKTAddress = (address: string) => isValidAddress(address) && address.startsWith('KT');
