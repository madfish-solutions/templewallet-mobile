import { BigNumber } from 'bignumber.js';

import { changeByPercentage, formatAssetAmount, invertSign, kFormatter, roundFiat } from './number.util';

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
    expect(formatAssetAmount(new BigNumber('123456789.25456'))).toEqual('123 456 789.25');
  });

  it('should format positive bignumber more than 1000 value and return string with 2 decimals using rounding mode up', () => {
    expect(formatAssetAmount(bigNumberMoreThanThousand)).toEqual('10 000.25');
  });

  it('should format positive bignumber less than 1000 value and return string with 1 decimal using rounding mode up', () => {
    expect(formatAssetAmount(new BigNumber(100.255133), 1)).toEqual('100.2');
  });
  it('should return empty string if NaN passed into', () => {
    expect(formatAssetAmount(new BigNumber(NaN), 1)).toEqual('');
  });

  it('should return 0 if 0 passed into', () => {
    expect(formatAssetAmount(new BigNumber(0), 1)).toEqual('0');
  });
  it('should return less-than sign if passed value is less than min rounded value', () => {
    expect(formatAssetAmount(new BigNumber(0.001), 2)).toEqual('< 0.01');
  });
  it('should return less-than sign if passed negative value is greater than min rounded value additive inverse', () => {
    expect(formatAssetAmount(new BigNumber('-0.0001'), 3)).toEqual('< -0.001');
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
  it('should not format number passing less than 1000', () => {
    expect(kFormatter(450)).toEqual('450');
  });

  it('should format number to thousands and return with K in the end, passing less than 1000', () => {
    expect(kFormatter(100 * 1000)).toEqual('100K');
  });

  it('should format number to millions and return with M in the end, passing more than 1 000 000', () => {
    expect(kFormatter(10 * 1000 * 1000)).toEqual('10M');
  });

  it('should format number to billions and return with B in the end, passing more than 1 000 000 000', () => {
    expect(kFormatter(10 * 1000 * 1000 * 1000)).toEqual('10B');
    expect(kFormatter(10 * 1000 * 1000 * 1000 * 1000)).toEqual('10,000B');
  });

  it('should return NaN passing NaN', () => {
    expect(kFormatter(NaN)).toEqual('');
  });
});

describe('changeByPercentage', () => {
  it('should decrease value if percentage is negative', () => {
    expect(changeByPercentage(new BigNumber(84), new BigNumber(-50))).toEqual(new BigNumber(42));
  });

  it('should increase value if percentage is positive', () => {
    expect(changeByPercentage(new BigNumber(84), new BigNumber(50))).toEqual(new BigNumber(126));
  });
});
