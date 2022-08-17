import { VisibilityEnum } from '../enums/visibility.enum';
import { DCP_TOKENS_METADATA, LOCAL_MAINNET_TOKENS_METADATA } from '../token/data/tokens-metadata';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';
import { getTokenSlug } from '../token/utils/token.utils';

export interface AccountStateInterface {
  isVisible: boolean;
  tezosBalance: string;
  tokensList: AccountTokenInterface[];
  dcpTokensList: AccountTokenInterface[];
  removedTokensList: string[];
}

export const initialAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: '0',
  tokensList: LOCAL_MAINNET_TOKENS_METADATA.map(token => ({
    slug: getTokenSlug(token),
    balance: '0',
    visibility: VisibilityEnum.Visible
  })),
  dcpTokensList: DCP_TOKENS_METADATA.map(token => ({
    slug: getTokenSlug(token),
    balance: '0',
    visibility: VisibilityEnum.Visible
  })),
  removedTokensList: []
};

export const emptyAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: '0',
  tokensList: [],
  dcpTokensList: [],
  removedTokensList: []
};
