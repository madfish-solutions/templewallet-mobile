import { YOUVES_TOKENS } from '../apis/youves/constants';

export const getDelegateText = (token: { symbol: string }) => (YOUVES_TOKENS.includes(token.symbol) ? 'APR' : 'APY');
