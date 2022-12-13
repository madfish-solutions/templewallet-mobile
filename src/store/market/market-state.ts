import { MarketCoinsSortFieldEnum } from '../../enums/market-coins-sort-field.enum';
import { LoadableEntityState } from '../types';
import { createEntity } from './../create-entity';
import { MarketCoin } from './market.interfaces';

export interface MarketState {
  favouriteTokens: Array<string>;
  sortField: MarketCoinsSortFieldEnum;
  tokens: LoadableEntityState<Array<MarketCoin>>;
  tokensSlugs: LoadableEntityState<Record<string, string>>;
}

export const marketInitialState: MarketState = {
  favouriteTokens: [],
  sortField: MarketCoinsSortFieldEnum.Volume,
  tokens: createEntity([]),
  tokensSlugs: createEntity({})
};

export interface MarketRootState {
  market: MarketState;
}
