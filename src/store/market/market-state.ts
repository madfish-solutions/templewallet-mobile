import { MarketTokensSortFieldEnum } from '../../enums/market-tokens-sort-field.enum';
import { LoadableEntityState } from '../types';
import { createEntity } from './../create-entity';
import { MarketToken } from './market.interfaces';

export interface MarketState {
  favouriteTokensIds: Array<string>;
  sortField: MarketTokensSortFieldEnum;
  tokens: LoadableEntityState<Array<MarketToken>>;
  tokensIdsToSlugs: LoadableEntityState<Record<string, string>>;
}

export const marketInitialState: MarketState = {
  favouriteTokensIds: [],
  sortField: MarketTokensSortFieldEnum.Volume,
  tokens: createEntity([]),
  tokensIdsToSlugs: createEntity({})
};
