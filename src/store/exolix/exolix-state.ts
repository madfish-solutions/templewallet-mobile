import { TopUpWithNetworkInterface } from 'src/interfaces/topup.interface';
import { ExchangeDataInterface } from 'src/types/exolix.types';

export const exolixInitialState: ExolixState = {
  step: 0,
  exchangeData: null,
  currencies: [],
  currenciesLoading: false
};

export interface ExolixState {
  step: number;
  exchangeData: ExchangeDataInterface | null;
  currencies: TopUpWithNetworkInterface[];
  currenciesLoading: boolean;
}
