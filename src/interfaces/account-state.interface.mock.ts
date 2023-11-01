import { mockAccountTokens } from '../token/interfaces/account-token.interface.mock';

import { AccountStateInterface } from './account-state.interface';

export const mockAccountState: AccountStateInterface = {
  isVisible: true,
  tezosBalance: '100',
  tokensList: mockAccountTokens,
  dcpTokensList: mockAccountTokens,
  removedTokensList: []
};
