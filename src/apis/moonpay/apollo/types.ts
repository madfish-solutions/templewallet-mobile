interface Currency {
  id: string;
  name: string;
  code: string;
  icon: string;
  minBuyAmount: number | null;
  maxBuyAmount: number | null;
  precision: number;
}

export interface FiatCurrency extends Currency {
  minBuyAmount: number;
  maxBuyAmount: number;
  lowLimitAmount: number;
}

export interface CryptoCurrency extends Currency {
  networkCode: string;
  supportsLiveMode: boolean;
  isSuspended: boolean;
}

export interface CryptoCurrenciesResponse {
  cryptoCurrencies: CryptoCurrency[];
}

export interface FiatCurrenciesResponse {
  fiatCurrencies: FiatCurrency[];
}
