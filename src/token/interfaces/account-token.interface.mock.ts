import { VisibilityEnum } from '../../enums/visibility.enum';
import { PREDEFINED_MAINNET_TOKENS_METADATA } from '../data/tokens-metadata';
import { getTokenSlug } from '../utils/token.utils';
import { AccountTokenInterface } from './account-token.interface';

export const mockAccountTokens: AccountTokenInterface[] = PREDEFINED_MAINNET_TOKENS_METADATA.map(token => ({
  slug: getTokenSlug(token),
  balance: '33',
  visibility: VisibilityEnum.Visible
}));
