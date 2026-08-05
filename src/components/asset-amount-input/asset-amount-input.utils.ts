import BigNumber from 'bignumber.js';

import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

export const FIAT_AMOUNT_DECIMALS = 2;
export const MIN_FIAT_INPUT_AMOUNT = new BigNumber(10).pow(-FIAT_AMOUNT_DECIMALS);

export const tokenToDollarAmount = (
  tokenMutezAmount: BigNumber,
  decimals: number,
  exchangeRate: number,
  fiatDecimals = decimals
) =>
  mutezToTz(tokenMutezAmount, decimals).multipliedBy(exchangeRate).decimalPlaces(fiatDecimals, BigNumber.ROUND_FLOOR);

export const dollarToTokenAmount = (dollarMutezAmount: BigNumber, decimals: number, exchangeRate: number) =>
  tzToMutez(dollarMutezAmount, decimals).dividedBy(exchangeRate).decimalPlaces(0);

export const getFiatInputAmount = (tokenMutezAmount: BigNumber, decimals: number, exchangeRate: number) => {
  const fiatAmount = tokenToDollarAmount(tokenMutezAmount, decimals, exchangeRate, FIAT_AMOUNT_DECIMALS);

  return fiatAmount.isZero() && tokenMutezAmount.isGreaterThan(0) ? MIN_FIAT_INPUT_AMOUNT : fiatAmount;
};

export const convertAssetAmountInput = (
  amount: BigNumber | undefined,
  decimals: number,
  exchangeRate: number,
  isTokenInputType: boolean
) => {
  if (!amount) {
    return undefined;
  }

  return isTokenInputType
    ? mutezToTz(dollarToTokenAmount(amount, decimals, exchangeRate), decimals)
    : getFiatInputAmount(tzToMutez(amount, decimals), decimals, exchangeRate);
};
