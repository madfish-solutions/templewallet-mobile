import { BigNumber } from 'bignumber.js';

import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { isKTAddress, isValidAddress, mutezToTz, tzToMutez } from './tezos.util';

const mockNaNBigNumber = new BigNumber(NaN);
const mockMutezValue = new BigNumber(100000);
const mockTzValue = new BigNumber(0.1);

const mockKtAddress = 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn';
const mockTzAddress = 'tz1XFDgWRqHBbFJmgXqVshnBzVg2SRBZGuXi';
const mockNonAddress = 'mockStrng';
const mockEmptyAddress = '';

describe('mutezToTz', () => {
  it('should not map NaN value', () => {
    expect(mutezToTz(mockNaNBigNumber, 10).toNumber()).toEqual(NaN);
  });
  it('should correctly map TEZ value', () => {
    expect(mutezToTz(mockMutezValue, TEZ_TOKEN_METADATA.decimals).toNumber()).toEqual(0.1);
  });
  it('should correctly map fiat value', () => {
    expect(mutezToTz(mockMutezValue, 2).toNumber()).toEqual(1000);
  });
});

describe('tzToMutez', () => {
  it('should not map NaN value', () => {
    expect(tzToMutez(mockNaNBigNumber, 10).toNumber()).toEqual(NaN);
  });
  it('should correctly map TEZ value', () => {
    expect(tzToMutez(mockTzValue, TEZ_TOKEN_METADATA.decimals).toNumber()).toEqual(100000);
  });
  it('should correctly map fiat value', () => {
    expect(tzToMutez(mockTzValue, 2).toNumber()).toEqual(10);
  });
});

describe('isValidAddress', () => {
  it('should return true for KT address', () => {
    expect(isValidAddress(mockKtAddress)).toEqual(true);
  });
  it('should return true for tz address', () => {
    expect(isValidAddress(mockTzAddress)).toEqual(true);
  });
  it('should return false for non-address string', () => {
    expect(isValidAddress(mockNonAddress)).toEqual(false);
  });
  it('should return false for empty address', () => {
    expect(isValidAddress(mockEmptyAddress)).toEqual(false);
  });
});

describe('isKTAddress', () => {
  it('should return true for KT address', () => {
    expect(isKTAddress(mockKtAddress)).toEqual(true);
  });
  it('should return false for tz address', () => {
    expect(isKTAddress(mockTzAddress)).toEqual(false);
  });
  it('should return false for non-address string', () => {
    expect(isKTAddress(mockNonAddress)).toEqual(false);
  });
  it('should return false for empty address', () => {
    expect(isKTAddress(mockEmptyAddress)).toEqual(false);
  });
});
