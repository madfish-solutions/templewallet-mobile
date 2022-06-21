import { mockHdAccount } from '../../interfaces/account.interface.mock';
import { mockWalletAccountState } from '../../interfaces/wallet-account-state.interface.mock';
import { mockFA1_2TokenMetadata, mockFA2TokenMetadata } from '../../token/interfaces/token-metadata.interface.mock';
import { getTokenSlug } from '../../token/utils/token.utils';
import { QUIPU_DEFAULT_PERCENTAGE } from '../../utils/quipu-apy.util';
import { createEntity } from '../create-entity';
import { WalletState } from './wallet-state';

export const mockWalletState: WalletState = {
  accounts: [mockWalletAccountState],
  selectedAccountPublicKeyHash: mockHdAccount.publicKeyHash,
  tokensMetadata: {
    [getTokenSlug(mockFA1_2TokenMetadata)]: mockFA1_2TokenMetadata,
    [getTokenSlug(mockFA2TokenMetadata)]: mockFA2TokenMetadata
  },
  addTokenSuggestion: createEntity(mockFA1_2TokenMetadata)
};
