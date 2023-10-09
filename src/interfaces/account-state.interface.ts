import { VisibilityEnum } from '../enums/visibility.enum';
import { PREDEFINED_MAINNET_TOKENS_METADATA, PREDEFINED_DCP_TOKENS_METADATA } from '../token/data/tokens-metadata';
import { AccountTokenInterface } from '../token/interfaces/account-token.interface';
import { getTokenSlug } from '../token/utils/token.utils';

export interface AccountStateInterface {
  isVisible: boolean;
  tezosBalance: string;
  tokensList: AccountTokenInterface[];
  dcpTokensList: AccountTokenInterface[];
  removedTokensList: string[];
}

/** @deprecated // BAD PRACTICE */
export const initialAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: '0',
  tokensList: PREDEFINED_MAINNET_TOKENS_METADATA.map(token => ({
    slug: getTokenSlug(token),
    balance: '0',
    visibility: VisibilityEnum.Visible
  })),
  dcpTokensList: PREDEFINED_DCP_TOKENS_METADATA.map(token => ({
    slug: getTokenSlug(token),
    balance: '0',
    visibility: VisibilityEnum.Visible
  })),
  removedTokensList: []
};

/** @deprecated // BAD PRACTICE */
export const emptyAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: '0',
  tokensList: [],
  dcpTokensList: [],
  removedTokensList: []
};
