import { validateAddress, ValidationResult } from '@taquito/utils';
import { BigNumber } from 'bignumber.js';

import { TokenInterface, TokenPreviewType } from '../token/interfaces/token.interface';
import { isDefined } from './is-defined';

export const mutezToTz = (bigNum: BigNumber, decimals: number) => {
  if (bigNum.isNaN()) {
    return bigNum;
  }

  return bigNum.integerValue().div(new BigNumber(10).pow(decimals));
};

export const tzToMutez = (bigNum: BigNumber, decimals: number) => {
  if (bigNum.isNaN()) {
    return bigNum;
  }

  return bigNum.decimalPlaces(decimals).times(new BigNumber(10).pow(decimals));
};

export const isCollectible = <T extends TokenPreviewType>(asset: T) => isDefined(asset.artifactUri);

export const isValidAddress = (address: string) => validateAddress(address) === ValidationResult.VALID;

export const isZeroBalance = (asset: TokenInterface) => asset.balance === '0';

export const isKTAddress = (address: string) => address.startsWith('KT');
