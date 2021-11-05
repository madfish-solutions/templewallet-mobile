import { BigNumber } from 'bignumber.js';

import { formatAssetAmount, invertSign, kFormatter, roundFiat } from './number.util';

const bigNumberMoreThanThousand = new BigNumber(10000.255);

describe('formatAssetAmount', () => {
  it('should format positive bignumber value and return string with 6 decimals', () => {
    expect(formatAssetAmount(new BigNumber(100.255555555))).toEqual('100.255555');
  });

  it('should format positive bignumber less than 1000 value and return string with 3 decimals', () => {
    expect(formatAssetAmount(new BigNumber(100.255))).toEqual('100.255');
  });

  it('should format positive bignumber more than 1000 value and return string with 2 decimals', () => {
    expect(formatAssetAmount(bigNumberMoreThanThousand)).toEqual('10 000.25');
  });

  it('should format positive bignumber more than 10 000 000 value and return formatted string', () => {
    expect(formatAssetAmount(new BigNumber(10123456))).toEqual('10 123 456');
  });

  it('should format positive bignumber more than 1 000 000 value and return string with 2 decimals', () => {
    expect(formatAssetAmount(new BigNumber('123456789.25456'), BigNumber.ROUND_UP)).toEqual('123 456 789.26');
  });

  it('should format positive bignumber more than 1000 value and return string with 2 decimals using rounding mode up', () => {
    expect(formatAssetAmount(bigNumberMoreThanThousand, BigNumber.ROUND_UP)).toEqual('10 000.26');
  });

  it('should format positive bignumber less than 1000 value and return string with 1 decimal using rounding mode up', () => {
    expect(formatAssetAmount(new BigNumber(100.255133), BigNumber.ROUND_UP, 1)).toEqual('100.3');
  });

  it('should return empty string if NaN passed into', () => {
    expect(formatAssetAmount(new BigNumber(NaN), BigNumber.ROUND_UP, 1)).toEqual('');
  });

  it('should return 0 if 0 passed into', () => {
    expect(formatAssetAmount(new BigNumber(0), BigNumber.ROUND_UP, 1)).toEqual('0');
  });
});

describe('roundFiat', () => {
  it('should return rounded up value', () => {
    expect(roundFiat(new BigNumber(100.255), BigNumber.ROUND_UP).toNumber()).toEqual(100.26);
  });

  it('should return exact value passing bignumber with 2 decimals', () => {
    expect(roundFiat(new BigNumber(100.25), BigNumber.ROUND_UP).toNumber()).toEqual(100.25);
  });
  it('should return 0 if NaN passed', () => {
    expect(roundFiat(new BigNumber(NaN), BigNumber.ROUND_UP).toNumber()).toEqual(0);
  });
});

describe('invertSign', () => {
  it('should return inverted value passing positive value', () => {
    expect(invertSign('123')).toEqual('-123');
  });

  it('should return inverted value passing negative value', () => {
    expect(invertSign('-123')).toEqual('123');
  });
});

describe('kFormatter', () => {
  it('should format number to thousands and return with K in the end, passing less than 1000 k', () => {
    expect(kFormatter(100000)).toEqual('100 K');
  });

  it('should format number to thousands and return with K in the end, passing more than 1000 k', () => {
    expect(kFormatter(10000000)).toEqual('10,000 K');
  });

  it('should return NaN passing NaN', () => {
    expect(kFormatter(NaN)).toEqual('');
  });
});
