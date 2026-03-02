import BigNumber from 'bignumber.js';

import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

export const tokenToDollarAmount = (tokenMutezAmount: BigNumber, decimals: number, exchangeRate: number) =>
  mutezToTz(tokenMutezAmount, decimals).multipliedBy(exchangeRate).decimalPlaces(decimals);

export const dollarToTokenAmount = (dollarMutezAmount: BigNumber, decimals: number, exchangeRate: number) =>
  tzToMutez(dollarMutezAmount, decimals).dividedBy(exchangeRate).decimalPlaces(0);
