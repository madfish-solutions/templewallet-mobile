import { CurrenciesInterface, ExchangeDataInterface } from '../../interfaces/exolix.interface';

export const exolixInitialState: ExolixState = {
  step: 0,
  exchangeData: null,
  currencies: []
};

export interface ExolixState {
  step: number;
  exchangeData: ExchangeDataInterface | null;
  currencies: Array<CurrenciesInterface>;
}

export interface ExolixRootState {
  exolix: ExolixState;
}
