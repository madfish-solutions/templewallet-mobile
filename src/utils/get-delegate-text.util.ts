import { YOUVES_TOKENS } from '../apis/youves/constants';
import { TokenInterface } from '../token/interfaces/token.interface';

export const getDelegateText = (token: TokenInterface) => (YOUVES_TOKENS.includes(token.symbol) ? 'APR' : 'APY');
