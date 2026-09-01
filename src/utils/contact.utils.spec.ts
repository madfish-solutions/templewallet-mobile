import {
  isEvmContactAddress,
  isTezosContactAddress,
  isValidContactAddress,
  truncateContactAddress
} from './contact.utils';

const evmAddress = '0xfDc237eff648793c9F3B976c702493f0EE056489';
const tezosAddress = 'tz1XFDgWRqHBbFJmgXqVshnBzVg2SRBZGuXi';

describe('contact utils', () => {
  it('recognizes EVM contact addresses', () => {
    expect(isEvmContactAddress(evmAddress)).toBe(true);
    expect(isTezosContactAddress(evmAddress)).toBe(false);
  });

  it('recognizes Tezos contact addresses', () => {
    expect(isTezosContactAddress(tezosAddress)).toBe(true);
    expect(isEvmContactAddress(tezosAddress)).toBe(false);
  });

  it('rejects unsupported addresses', () => {
    expect(isValidContactAddress('not-an-address')).toBe(false);
  });

  it('truncates a contact address for the list item', () => {
    expect(truncateContactAddress(evmAddress)).toBe('0xfDc2...6489');
  });
});
