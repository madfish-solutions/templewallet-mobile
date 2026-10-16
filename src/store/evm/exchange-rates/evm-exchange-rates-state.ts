export type EvmExchangeRatesRecord = Record<number, Record<string, number>>;

export interface EvmExchangeRatesState {
  record: EvmExchangeRatesRecord;
}

export const evmExchangeRatesInitialState: EvmExchangeRatesState = {
  record: {}
};
