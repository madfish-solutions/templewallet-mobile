export enum CurrencyInfoType {
  CRYPTO = 'CRYPTO',
  FIAT = 'FIAT'
}

export interface UtorgCurrencyInfo {
  currency: string;
  symbol: string;
  /** Crypto only */
  chain?: string;
  display: string;
  caption: string;
  explorerTx: string;
  explorerAddr: string;
  type: CurrencyInfoType;
  enabled: boolean;
  depositMin: number;
  depositMax: number;
  withdrawalMin: number;
  withdrawalMax: number;
  addressValidator: string;
  precision: number;
  allowTag: boolean;
}
