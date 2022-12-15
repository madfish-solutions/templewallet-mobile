import { MarketCoinsSortFieldEnum } from '../../enums/market-coins-sort-field.enum';
import { createEntity } from '../create-entity';
import { MarketState } from './market-state';

export const mockMarketState: MarketState = {
  favouriteTokens: [],
  sortField: MarketCoinsSortFieldEnum.Volume,
  tokens: createEntity([]),
  tokensSlugs: createEntity({})
};
