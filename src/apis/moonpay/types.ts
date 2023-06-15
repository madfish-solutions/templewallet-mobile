export enum CurrencyType {
  Fiat = 'fiat',
  Crypto = 'crypto'
}

interface CurrencyBase {
  id: string;
  name: string;
  code: string;
  minBuyAmount: number | null;
  maxBuyAmount: number | null;
  precision: number;
  type: CurrencyType;
}

export interface FiatCurrency extends CurrencyBase {
  minBuyAmount: number;
  maxBuyAmount: number;
  type: CurrencyType.Fiat;
  lowLimitAmount: number;
}

export interface CryptoCurrency extends CurrencyBase {
  type: CurrencyType.Crypto;
  metadata: {
    contractAddress: string | null;
    coinType: string | null;
    networkCode: string;
  };
  supportsLiveMode: boolean;
  isSuspended: boolean;
}

export type Currency = FiatCurrency | CryptoCurrency;

export interface QuoteResponse {
  baseCurrencyAmount: number;
  quoteCurrencyAmount: number;
  extraFeeAmount: number;
  extraFeePercentage: number;
  feeAmount: number;
  networkFeeAmount: number;
  totalAmount: number;
  baseCurrency: FiatCurrency;
  quoteCurrency: CryptoCurrency;
}
