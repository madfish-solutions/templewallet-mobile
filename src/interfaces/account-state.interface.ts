import { VisibilityEnum } from '../enums/visibility.enum';
import { DCP_TOKENS_METADATA, HIDDEN_WHITELIST_TOKENS, MAINNET_TOKENS_METADATA } from '../token/data/tokens-metadata';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';
import { getTokenSlug } from '../token/utils/token.utils';

export interface AccountStateInterface {
  isVisible: boolean;
  tezosBalance: string;
  tokensList: AccountTokenInterface[];
  dcpTokensList: AccountTokenInterface[];
  removedTokensList: string[];
  removedDcpTokensList: string[];
}

export const initialAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: '0',
  tokensList: [
    ...MAINNET_TOKENS_METADATA.map(token => ({
      slug: getTokenSlug(token),
      balance: '0',
      visibility: VisibilityEnum.Visible
    })),
    ...HIDDEN_WHITELIST_TOKENS.map(token => ({
      slug: getTokenSlug(token),
      balance: '0',
      visibility: VisibilityEnum.InitiallyHidden
    }))
  ],
  dcpTokensList: DCP_TOKENS_METADATA.map(token => ({
    slug: getTokenSlug(token),
    balance: '0',
    visibility: VisibilityEnum.Visible
  })),
  removedTokensList: [],
  removedDcpTokensList: []
};

export const emptyAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: '0',
  tokensList: [],
  dcpTokensList: [],
  removedTokensList: [],
  removedDcpTokensList: []
};
