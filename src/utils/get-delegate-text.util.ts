import { youvesTokens } from '../apis/youves/constants';
import { TokenInterface } from '../token/interfaces/token.interface';

export const getDelegateText = (token: TokenInterface) => (youvesTokens.includes(token.symbol) ? 'APR' : 'APY');
