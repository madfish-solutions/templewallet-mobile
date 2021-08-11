import { BigNumber } from 'bignumber.js';

import { formatAssetAmount } from './number.util';

const bigNumberMoreThanThousand = new BigNumber(10000.255);

describe('formatAssetAmount', () => {
  it('should format positive bignumber value and return string with 6 decimals', () => {
    expect(formatAssetAmount(new BigNumber(100.255555555))).toEqual('100.255555');
  });

  it('should format positive bignumber less than 1000 value and return string with 3 decimals', () => {
    expect(formatAssetAmount(new BigNumber(100.255))).toEqual('100.255');
  });

  it('should format positive bignumber more than 1000 value and return string with 2 decimals', () => {
    expect(formatAssetAmount(bigNumberMoreThanThousand)).toEqual('10000.25');
  });

  it('should format positive bignumber more than 1000 value and return string with 2 decimals using rounding mode up', () => {
    expect(formatAssetAmount(bigNumberMoreThanThousand, BigNumber.ROUND_UP)).toEqual('10000.26');
  });

  it('should format positive bignumber less than 1000 value and return string with 1 decimal using rounding mode up', () => {
    expect(formatAssetAmount(new BigNumber(100.255133), BigNumber.ROUND_UP, 1)).toEqual('100.3');
  });

  it('should return NaN if NaN passed into', () => {
    expect(formatAssetAmount(new BigNumber(NaN), BigNumber.ROUND_UP, 1)).toEqual(NaN);
  });

  it('should return 0 if 0 passed into', () => {
    expect(formatAssetAmount(new BigNumber(0), BigNumber.ROUND_UP, 1)).toEqual('0');
  });
});
