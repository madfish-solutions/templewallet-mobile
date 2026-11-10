import { BigNumber } from 'bignumber.js';

import { safeDecimalPlaces, safeShiftedBy, safeToFixed } from './big-number.utils';

const amount = new BigNumber('1234.5678');

describe('safeShiftedBy', () => {
  it('shifts by an integer number of places', () => {
    expect(safeShiftedBy(amount, -2).toString()).toEqual('12.345678');
  });

  it('returns the original value when the shift is missing or not an integer', () => {
    // `-undefined` is NaN, which is the Sentry crash: shiftedBy(NaN).
    expect(() => amount.shiftedBy(Number.NaN)).toThrow('[BigNumber Error] Argument not an integer: NaN');

    expect(safeShiftedBy(amount, undefined)).toBe(amount);
    expect(safeShiftedBy(amount, Number.NaN)).toBe(amount);
    expect(safeShiftedBy(amount, 1.5)).toBe(amount);
  });
});

describe('safeDecimalPlaces', () => {
  it('rounds to an integer number of decimal places', () => {
    expect(safeDecimalPlaces(amount, 2, BigNumber.ROUND_DOWN).toString()).toEqual('1234.56');
  });

  it('returns the original value when the decimal count would throw', () => {
    expect(() => amount.decimalPlaces(Number.NaN)).toThrow('[BigNumber Error] Argument not an integer: NaN');

    expect(safeDecimalPlaces(amount, undefined)).toBe(amount);
    expect(safeDecimalPlaces(amount, Number.NaN)).toBe(amount);
    expect(safeDecimalPlaces(amount, -1)).toBe(amount);
  });
});

describe('safeToFixed', () => {
  it('formats to an integer number of decimal places', () => {
    expect(safeToFixed(amount, 2, BigNumber.ROUND_DOWN)).toEqual('1234.56');
  });

  it('falls back to an unparameterized fixed string when the decimal count would throw', () => {
    expect(() => amount.toFixed(Number.NaN)).toThrow('[BigNumber Error] Argument not an integer: NaN');
    expect(safeToFixed(amount, Number.NaN)).toEqual(amount.toFixed());
    expect(safeToFixed(amount, undefined)).toEqual(amount.toFixed());
  });
});
