import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { mockEvmImportedAccount, mockHdAccount, mockTezosImportedAccount } from 'src/interfaces/account.interface.mock';
import { mockWalletState } from 'src/store/wallet/wallet-state.mock';

import {
  canUseAccountForChain,
  getAccountAddressForEvm,
  getAccountAddressForTezos,
  getAccountForChain,
  getSelectedAccountIdFromWallet
} from './account.utils';

describe('account facade helpers', () => {
  it('returns Tezos and EVM addresses for HD accounts', () => {
    expect(getAccountAddressForTezos(mockHdAccount)).toEqual(mockHdAccount.tezosAddress);
    expect(getAccountAddressForEvm(mockHdAccount)).toEqual(mockHdAccount.evmAddress);
    expect(getAccountForChain(mockHdAccount, TempleChainKind.EVM)).toEqual({
      id: mockHdAccount.id,
      chain: TempleChainKind.EVM,
      address: mockHdAccount.evmAddress,
      type: mockHdAccount.type,
      name: mockHdAccount.name
    });
  });

  it('returns only Tezos address for Tezos imported accounts', () => {
    expect(getAccountAddressForTezos(mockTezosImportedAccount)).toEqual(mockTezosImportedAccount.address);
    expect(getAccountAddressForEvm(mockTezosImportedAccount)).toBeUndefined();
    expect(canUseAccountForChain(mockTezosImportedAccount, TempleChainKind.Tezos)).toEqual(true);
    expect(canUseAccountForChain(mockTezosImportedAccount, TempleChainKind.EVM)).toEqual(false);
  });

  it('returns only EVM address for EVM imported accounts', () => {
    expect(getAccountAddressForTezos(mockEvmImportedAccount)).toBeUndefined();
    expect(getAccountAddressForEvm(mockEvmImportedAccount)).toEqual(mockEvmImportedAccount.address);
    expect(canUseAccountForChain(mockEvmImportedAccount, TempleChainKind.Tezos)).toEqual(false);
    expect(canUseAccountForChain(mockEvmImportedAccount, TempleChainKind.EVM)).toEqual(true);
  });

  it('falls back from deprecated selected pkh to selected account id', () => {
    expect(getSelectedAccountIdFromWallet({ ...mockWalletState, selectedAccountId: '' })).toEqual(mockHdAccount.id);
  });
});
