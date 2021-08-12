import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { mockFA1_2TokenMetadata } from '../token/interfaces/token-metadata.interface.mock';
import { getExchangeRateKey, tokenToUsd, usdToToken } from './exchange-rate.utils';

describe('getExchangeRateKey', () => {
  it("should return 'Tezos' if variable is Tezos", () => {
    expect(getExchangeRateKey(TEZ_TOKEN_METADATA)).toEqual('Tezos');
  });

  it('should return token slug if variable is a token', () => {
    expect(getExchangeRateKey(mockFA1_2TokenMetadata)).toEqual('fa12TokenAddress_0');
  });
});

describe('tokenToUsd', () => {
  it('should return USD equivalent for tokens amount if exchange rate is defined', () => {
    expect(tokenToUsd(1.77, 1.8)).toEqual(3.18);
  });

  it('should return NaN if exchange rate is undefined', () => {
    expect(tokenToUsd(1.77)).toBeNaN();
  });
});

describe('usdToToken', () => {
  it('should return equivalent tokens amount if exchange rate is defined and non-zero', () => {
    expect(usdToToken(3.18, mockFA1_2TokenMetadata.decimals, 1.8)).toEqual(1.766666);
  });

  it('should return NaN if exchange rate is undefined', () => {
    expect(usdToToken(3.18, mockFA1_2TokenMetadata.decimals)).toBeNaN();
  });

  it('should return NaN if exchange rate is zero', () => {
    expect(usdToToken(3.18, mockFA1_2TokenMetadata.decimals, 0)).toBeNaN();
  });
});
