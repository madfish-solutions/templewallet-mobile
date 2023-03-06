import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { shouldFilterTezos } from './filter.util';

describe('shouldFilterTezos', () => {
  it('should return false if zero balances should be hidden and tezos balance is zero', () => {
    expect(shouldFilterTezos('0', true, TEZ_TOKEN_METADATA)).toEqual(false);
  });

  it('should return true if zero balances should be hidden, tezos balance is not zero and search value is not specified', () => {
    expect(shouldFilterTezos('1', true, TEZ_TOKEN_METADATA)).toEqual(true);
  });

  it('should return true if zero balances should not be hidden, tezos balance is zero and search value is not specified', () => {
    expect(shouldFilterTezos('0', false, TEZ_TOKEN_METADATA)).toEqual(true);
  });

  it('should return true if tezos name includes search value (case-ignoring comparison)', () => {
    expect(shouldFilterTezos('1', false, TEZ_TOKEN_METADATA, 'OS')).toEqual(true);
  });

  it('should return true if tezos symbol includes search value', () => {
    expect(shouldFilterTezos('1', false, TEZ_TOKEN_METADATA, 'tez')).toEqual(true);
  });

  it('should return false if neither tezos symbol nor name include search value', () => {
    expect(shouldFilterTezos('1', false, TEZ_TOKEN_METADATA, 'foo')).toEqual(false);
  });
});
