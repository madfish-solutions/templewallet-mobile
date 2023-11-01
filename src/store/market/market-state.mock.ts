import { MarketTokensSortFieldEnum } from '../../enums/market-tokens-sort-field.enum';
import { createEntity } from '../create-entity';

import { MarketState } from './market-state';

export const mockMarketState: MarketState = {
  favouriteTokensIds: [],
  sortField: MarketTokensSortFieldEnum.Volume,
  tokens: createEntity([]),
  tokensIdsToSlugs: createEntity({})
};
