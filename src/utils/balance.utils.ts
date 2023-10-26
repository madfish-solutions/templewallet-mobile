import { BigNumber } from 'bignumber.js';

import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';

import { mutezToTz } from './tezos.util';

export const getDollarValue = (balance: string, token: TokenMetadataInterface, exchangeRate = 0) => {
  if (token.symbol === '' || token.symbol === '???') {
    return new BigNumber(0);
  }
  const dollarValue = mutezToTz(new BigNumber(balance), token.decimals).multipliedBy(exchangeRate);

  return dollarValue.isNaN() ? new BigNumber(0) : dollarValue;
};
