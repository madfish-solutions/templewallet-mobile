import { ExchangeDataInterface } from '../../interfaces/exolix.interface';
import { TopUpInputInterface } from '../../interfaces/topup.interface';

export const exolixInitialState: ExolixState = {
  step: 0,
  exchangeData: null,
  currencies: []
};

export interface ExolixState {
  step: number;
  exchangeData: ExchangeDataInterface | null;
  currencies: Array<TopUpInputInterface>;
}

export interface ExolixRootState {
  exolix: ExolixState;
}
