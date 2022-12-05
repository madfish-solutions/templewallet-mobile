import { LoadableEntityState } from '../types';
import { createEntity } from './../create-entity';
import { MarketCoin } from './market.interfaces';

export interface MarketState {
  tokens: LoadableEntityState<Array<MarketCoin>>;
}

export const marketInitialState: MarketState = {
  tokens: createEntity([])
};

export interface MarketRootState {
  market: MarketState;
}
