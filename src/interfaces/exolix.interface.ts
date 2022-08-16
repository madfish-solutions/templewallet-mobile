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
  coinFromNetwork: string;
  coinTo: string;
  coinToNetwork: string;
  amount: number;
  withdrawalAddress: string;
  withdrawalExtraId: string;
}

export interface CurrenciesInterface {
  name: string;
  code: string;
  network: string;
  networkFullName: string;
  icon: string;
  networkShortName?: string | null;
}

interface ExolixNetworkInterface {
  addressRegex: string;
  blockExplorer: string | null;
  depositMinAmount: number | null;
  isDefault: boolean;
  memoName: string;
  memoNeeded: boolean;
  memoRegex: string;
  name: string;
  network: string;
  notes: string;
  precision: number;
  shortName: string | null;
}

interface ExolixCurrenciesInterface {
  code: string;
  icon: string;
  name: string;
  networks: Array<ExolixNetworkInterface>;
}

export interface CurrenciesRequestInterface {
  data: Array<ExolixCurrenciesInterface>;
}

export interface RateInterface {
  toAmount: number;
  rate: number | null;
  minAmount: number;
}
