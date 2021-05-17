import { LoadableEntityState } from '../store/types';
import { MAINNET_TOKENS_METADATA } from '../token/data/tokens-metadata';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';
import { tokenMetadataSlug } from '../token/utils/token.utils';

export interface AccountSettingsInterface {
  tezosBalance: LoadableEntityState<string>;
  tokensList: AccountTokenInterface[];
}

export const initialAccountSettings: AccountSettingsInterface = {
  tezosBalance: { isLoading: false, data: '0' },
  tokensList: MAINNET_TOKENS_METADATA.map(token => ({ slug: tokenMetadataSlug(token), balance: '0', isShown: true }))
};
