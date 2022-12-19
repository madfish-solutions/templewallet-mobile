import { MarketCoinsSortFieldEnum } from '../../enums/market-coins-sort-field.enum';
import { LoadableEntityState } from '../types';
import { createEntity } from './../create-entity';
import { MarketCoin } from './market.interfaces';

export interface MarketState {
  favouriteTokensIds: Array<string>;
  sortField: MarketCoinsSortFieldEnum;
  tokens: LoadableEntityState<Array<MarketCoin>>;
  tokensIdsToSlugs: LoadableEntityState<Record<string, string>>;
}

export const marketInitialState: MarketState = {
  favouriteTokensIds: [],
  sortField: MarketCoinsSortFieldEnum.Volume,
  tokens: createEntity([]),
  tokensIdsToSlugs: createEntity({})
};

export interface MarketRootState {
  market: MarketState;
}
