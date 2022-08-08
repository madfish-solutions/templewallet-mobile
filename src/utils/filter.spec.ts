import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { filterTezos } from './filter.util';

describe('filterTezos', () => {
  it('should return false if zero balances should be hidden and tezos balance is zero', () => {
    expect(filterTezos('0', true, TEZ_TOKEN_METADATA)).toEqual(false);
  });

  it('should return true if zero balances should be hidden, tezos balance is not zero and search value is not specified', () => {
    expect(filterTezos('1', true, TEZ_TOKEN_METADATA)).toEqual(true);
  });

  it('should return true if zero balances should not be hidden, tezos balance is zero and search value is not specified', () => {
    expect(filterTezos('0', false, TEZ_TOKEN_METADATA)).toEqual(true);
  });

  it('should return true if tezos name includes search value (case-ignoring comparison)', () => {
    expect(filterTezos('1', false, TEZ_TOKEN_METADATA, 'OS')).toEqual(true);
  });

  it('should return true if tezos symbol includes search value', () => {
    expect(filterTezos('1', false, TEZ_TOKEN_METADATA, 'tez')).toEqual(true);
  });

  it('should return false if neither tezos symbol nor name include search value', () => {
    expect(filterTezos('1', false, TEZ_TOKEN_METADATA, 'foo')).toEqual(false);
  });
});
