import { createActions } from '../create-actions';
import { MarketCoin } from './market.interfaces';

export const loadMarketTopCoinsActions = createActions<void, Array<MarketCoin>, string>('market/MARKET_TOP_COINS');
