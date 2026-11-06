import BigNumber from 'bignumber.js';

import { safeDecimalPlaces } from 'src/utils/big-number.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';

export const FIAT_AMOUNT_DECIMALS = 2;
const MIN_FIAT_INPUT_AMOUNT = new BigNumber(10).pow(-FIAT_AMOUNT_DECIMALS);

export const tokenToDollarAmount = (
  tokenMutezAmount: BigNumber,
  decimals: number,
  exchangeRate: number,
  fiatDecimals = decimals
) =>
  safeDecimalPlaces(
    mutezToTz(tokenMutezAmount, decimals).multipliedBy(exchangeRate),
    fiatDecimals,
    BigNumber.ROUND_FLOOR
  );

export const dollarToTokenAmount = (dollarMutezAmount: BigNumber, decimals: number, exchangeRate: number) =>
  safeDecimalPlaces(tzToMutez(dollarMutezAmount, decimals).dividedBy(exchangeRate), 0);

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
