import { ExchangeDataInterface } from 'src/interfaces/exolix.interface';
import { TopUpWithNetworkInterface } from 'src/interfaces/topup.interface';

export const exolixInitialState: ExolixState = {
  step: 0,
  exchangeData: null,
  currencies: []
};

export interface ExolixState {
  step: number;
  exchangeData: ExchangeDataInterface | null;
  currencies: TopUpWithNetworkInterface[];
}
