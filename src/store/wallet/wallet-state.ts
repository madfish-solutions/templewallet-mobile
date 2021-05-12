import { AccountSettingsInterface } from '../../interfaces/account-settings.interface';
import { AccountInterface } from '../../interfaces/account.interface';
import { MainnetTokensMetadata } from '../../token/data/tokens-metadata';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';

export interface WalletState {
  hdAccounts: (AccountInterface & AccountSettingsInterface)[];
  selectedAccountPublicKeyHash: string;
  tokensMetadataList: TokenMetadataInterface[];
}

export const walletInitialState: WalletState = {
  hdAccounts: [],
  selectedAccountPublicKeyHash: '',
  tokensMetadataList: MainnetTokensMetadata
};

export interface WalletRootState {
  wallet: WalletState;
}
