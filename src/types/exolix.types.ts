interface ExchangeCoin {
  coinCode: string;
  coinName: string;
  icon: string;
  memoName: string;
  network: string;
  networkName: string;
  networkShortName: string;
}

interface ExchangeHash {
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

export interface SubmitExchangePayload extends Omit<ExchangePayload, 'coinFromNetwork' | 'coinToNetwork'> {
  networkFrom: string;
  networkTo: string;
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

export interface ExolixCurrenciesResponseInterface {
  data: Array<ExolixCurrenciesInterface>;
}

export interface GetRateRequestData {
  coinFrom: string;
  coinFromNetwork: string;
  coinTo: string;
  coinToNetwork: string;
  amount: number;
}

interface GetRateResponseWithAmountTooLow {
  fromAmount: number;
  toAmount: number;
  message: string;
  minAmount: number;
}

interface GetRateResponseWithAmountTooHigh {
  fromAmount: number;
  toAmount: number;
  message: string;
  maxAmount: number;
}

interface GetRateSuccessResponse {
  fromAmount: number;
  toAmount: number;
  rate: number;
  message: null;
  minAmount: number;
  withdrawMin: number;
  maxAmount: number;
}

export type GetRateResponse =
  | GetRateResponseWithAmountTooLow
  | GetRateResponseWithAmountTooHigh
  | GetRateSuccessResponse;
