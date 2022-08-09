import { VisibilityEnum } from '../../enums/visibility.enum';
import { getTokenSlug } from '../utils/token.utils';
import { AccountTokenInterface } from './account-token.interface';

export const mockAccountTokens: AccountTokenInterface[] = [
  {
    id: 0,
    address: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
    name: 'Quipuswap governance token',
    symbol: 'QUIPU',
    decimals: 6,
    thumbnailUri: 'https://quipuswap.com/tokens/quipu.png'
  }
].map(token => ({
  slug: getTokenSlug(token),
  balance: '33',
  visibility: VisibilityEnum.Visible
}));
