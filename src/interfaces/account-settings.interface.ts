import { LoadableEntityState } from '../store/types';
import { MainnetTokensMetadata } from '../token/data/tokens-metadata';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';
import { tokenMetadataSlug } from '../token/utils/token.utils';

export interface AccountSettingsInterface {
  tezosBalance: LoadableEntityState<string>;
  tokensList: AccountTokenInterface[];
}

export const emptyAccountSettings: AccountSettingsInterface = {
  tezosBalance: { isLoading: false, data: '0' },
  tokensList: []
};

export const initialAccountSettings: AccountSettingsInterface = {
  tezosBalance: { isLoading: false, data: '0' },
  tokensList: MainnetTokensMetadata.map(token => ({ slug: tokenMetadataSlug(token), balance: '0', isShown: true }))
};
