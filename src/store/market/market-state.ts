import { MarketCoinsSortFieldEnum } from '../../enums/market-coins-sort-field.enum';
import { LoadableEntityState } from '../types';
import { createEntity } from './../create-entity';
import { MarketCoin } from './market.interfaces';

export interface MarketState {
  tokens: LoadableEntityState<Array<MarketCoin>>;
  sortField: MarketCoinsSortFieldEnum;
  favouriteTokens: Array<string>;
}

export const marketInitialState: MarketState = {
  tokens: createEntity([]),
  sortField: MarketCoinsSortFieldEnum.Volume,
  favouriteTokens: []
};

export interface MarketRootState {
  market: MarketState;
}
