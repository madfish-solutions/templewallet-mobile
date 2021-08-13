import { BigNumber } from 'bignumber.js';

import { mockFA1_2TokenMetadata } from '../token/interfaces/token-metadata.interface.mock';
import { tokenToUsd, usdToToken } from './exchange-rate.utils';

describe('tokenToUsd', () => {
  it('should return USD equivalent for tokens amount if exchange rate is defined', () => {
    expect(tokenToUsd(1.77, 1.8)).toEqual(new BigNumber(3.18));
  });

  it('should return NaN if exchange rate is undefined', () => {
    expect(tokenToUsd(1.77)).toEqual(new BigNumber(NaN));
  });
});

describe('usdToToken', () => {
  it('should return equivalent tokens amount if exchange rate is defined and non-zero', () => {
    expect(usdToToken(3.18, mockFA1_2TokenMetadata.decimals, 1.8)).toEqual(new BigNumber(1.766666));
  });

  it('should return NaN if exchange rate is undefined', () => {
    expect(usdToToken(3.18, mockFA1_2TokenMetadata.decimals)).toEqual(new BigNumber(NaN));
  });

  it('should return NaN if exchange rate is zero', () => {
    expect(usdToToken(3.18, mockFA1_2TokenMetadata.decimals, 0)).toEqual(new BigNumber(NaN));
  });
});
