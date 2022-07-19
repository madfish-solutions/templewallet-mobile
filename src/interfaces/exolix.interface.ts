export interface ExchangeCoin {
  coinCode: string;
  coinName: string;
  icon: string;
  memoName: string;
  network: string;
  networkName: string;
  networkShortName: string;
}

export interface ExchangeHash {
  hash: string | null;
  link: string | null;
}

export interface ExchangeDataInterface {
  amount: string;
  amountTo: string;
  coinFrom: ExchangeCoin;
  coinTo: ExchangeCoin;
  createdAt: string;
  depositAddress: string;
  depositExtraId: string | null;
  withdrawalAddress: string;
  withdrawalExtraId: string | null;
  hashIn: ExchangeHash;
  hashOut: ExchangeHash;
  id: string;
  comment: string | null;
  rate: string;
  status: string;
}

export enum ExchangeDataStatusEnum {
  WAIT = 'wait',
  CONFIRMATION = 'confirmation',
  EXCHANGING = 'exchanging',
  SUCCESS = 'success',
  OVERDUE = 'overdue',
  REFUNDED = 'refunded'
}

export interface ExchangePayload {
  coinFrom: string;
  coinTo: string;
  amount: number;
  withdrawalAddress: string;
  withdrawalExtraId: string;
}

export interface CurrenciesInterface {
  icon: string;
  name: string;
  code: string;
}

export interface CurrenciesRequestInterface {
  data: Array<CurrenciesInterface>;
}

export interface RateInterface {
  toAmount: number;
  rate: number | null;
  minAmount: number;
}
