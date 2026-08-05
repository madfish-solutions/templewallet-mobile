import { BigNumber } from 'bignumber.js';

import {
  convertAssetAmountInput,
  FIAT_AMOUNT_DECIMALS,
  getFiatInputAmount,
  tokenToDollarAmount
} from './asset-amount-input.utils';

describe('asset amount input conversions', () => {
  it('converts token input to a two-decimal fiat amount', () => {
    const fiatAmount = convertAssetAmountInput(new BigNumber('1.234567'), 6, 2.5, false);

    expect(fiatAmount?.toFixed()).toBe('3.08');
  });

  it('converts fiat input to the sendable token amount', () => {
    const tokenAmount = convertAssetAmountInput(new BigNumber('3.08'), 6, 2.5, true);

    expect(tokenAmount?.toFixed()).toBe('1.232');
  });

  it('uses two fractional digits when displaying an existing token amount in fiat', () => {
    expect(tokenToDollarAmount(new BigNumber('1234567'), 6, 2.5, FIAT_AMOUNT_DECIMALS).toFixed()).toBe('3.08');
  });

  it('displays a positive sub-cent token value as one cent', () => {
    expect(getFiatInputAmount(new BigNumber('100'), 6, 2.5).toFixed()).toBe('0.01');
  });
});
