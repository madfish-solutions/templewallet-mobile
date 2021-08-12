import { MAINNET_TOKENS_METADATA } from '../data/tokens-metadata';
import { getTokenSlug } from '../utils/token.utils';
import { AccountTokenInterface } from './account-token.interface';

export const mockAccountTokens: AccountTokenInterface[] = MAINNET_TOKENS_METADATA.map(token => ({
  slug: getTokenSlug(token),
  balance: '33',
  isVisible: true
}));
