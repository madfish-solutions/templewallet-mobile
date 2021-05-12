import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { MainnetTokensMetadata } from '../../token/data/tokens-metadata';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { tokenMetadataSlug } from '../../token/utils/token.utils';

export interface WalletState {
  hdAccounts: WalletAccountInterface[];
  selectedAccountPublicKeyHash: string;
  tokensMetadata: Record<string, TokenMetadataInterface>;
}

export const walletInitialState: WalletState = {
  hdAccounts: [],
  selectedAccountPublicKeyHash: '',
  tokensMetadata: MainnetTokensMetadata.reduce(
    (obj, tokenMetadata) => ({
      ...obj,
      [tokenMetadataSlug(tokenMetadata)]: tokenMetadata
    }),
    {}
  )
};

export interface WalletRootState {
  wallet: WalletState;
}
