export enum CurrencyType {
  Fiat = 'fiat',
  Crypto = 'crypto'
}

interface CurrencyBase {
  type: CurrencyType;
  id: string;
  code: string;
  name: string;
  precision: number;
  minBuyAmount: number | null;
  maxBuyAmount: number | null;
}

export interface FiatCurrency extends CurrencyBase {
  type: CurrencyType.Fiat;
  minBuyAmount: number;
  maxBuyAmount: number;
  /** @deprecated */
  minAmount: number;
  /** @deprecated */
  maxAmount: number;
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
