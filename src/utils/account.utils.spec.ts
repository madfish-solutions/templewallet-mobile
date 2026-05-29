import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { mockEvmImportedAccount, mockHdAccount, mockTezosImportedAccount } from 'src/interfaces/account.interface.mock';

import {
  canUseAccountForChain,
  getAccountAddressForEvm,
  getAccountAddressForTezos,
  getAccountForChain
} from './account.utils';

describe('account facade helpers', () => {
  it('returns Tezos and EVM addresses for HD accounts', () => {
    expect(getAccountAddressForTezos(mockHdAccount)).toEqual(mockHdAccount.tezosAddress);
    expect(getAccountAddressForEvm(mockHdAccount)).toEqual(mockHdAccount.evmAddress);
    expect(getAccountForChain(mockHdAccount, TempleChainKind.EVM)).toEqual({
      id: mockHdAccount.id,
      chain: TempleChainKind.EVM,
      address: mockHdAccount.evmAddress,
      publicKey: mockHdAccount.evmPublicKey,
      type: mockHdAccount.type,
      name: mockHdAccount.name
    });
  });

  it('returns imported Tezos account address for chain facades', () => {
    expect(getAccountAddressForTezos(mockTezosImportedAccount)).toEqual(mockTezosImportedAccount.address);
    expect(getAccountAddressForEvm(mockTezosImportedAccount)).toEqual(mockTezosImportedAccount.address);
    expect(canUseAccountForChain(mockTezosImportedAccount, TempleChainKind.Tezos)).toEqual(true);
    expect(canUseAccountForChain(mockTezosImportedAccount, TempleChainKind.EVM)).toEqual(true);
  });

  it('returns imported EVM account address for chain facades', () => {
    expect(getAccountAddressForTezos(mockEvmImportedAccount)).toEqual(mockEvmImportedAccount.address);
    expect(getAccountAddressForEvm(mockEvmImportedAccount)).toEqual(mockEvmImportedAccount.address);
    expect(canUseAccountForChain(mockEvmImportedAccount, TempleChainKind.Tezos)).toEqual(true);
    expect(canUseAccountForChain(mockEvmImportedAccount, TempleChainKind.EVM)).toEqual(true);
  });
});
