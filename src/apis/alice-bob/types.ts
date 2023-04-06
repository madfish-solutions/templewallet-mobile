enum AliceBobOrderStatusEnum {
  WAITING = 'WAITING',
  EXCHANGING = 'EXCHANGING',
  SENDING = 'SENDING',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  FAILED = 'FAILED',
  HOLDED = 'HOLDED',
  REFUNDED = 'REFUNDED',
  PREPARED = 'PREPARED'
}

enum AliceBobOrderSideEnum {
  SELL = 'SELL',
  BUY = 'BUY'
}

export interface AliceBobOrderInfoInterface {
  id: string;
  status: AliceBobOrderStatusEnum;
  from: string;
  to: string;
  payUrl: string;
  payCryptoAddress: string;
  payCryptoMemo: string;
  fromPaymentDetails: string;
  toPaymentDetails: string;
  toMemo: string;
  fromTxHash: string;
  toTxHash: string;
  fromAmount: number;
  fromAmountReceived: number;
  toAmount: number;
  fromRate: number;
  toRate: number;
  fromFee: number;
  toFee: number;
  side: AliceBobOrderSideEnum;
  extraFromFee: number;
  extraToFee: number;
  redirectUrl: string;
  userId: string;
  partnerOrderId: string;
  fromRevenueShare: number;
  toRevenueShare: number;
  created: string;
  updated: string;
  orderExpirationTimetamp: number;
}

export interface PairInfoResponse {
  minAmount: number;
  maxAmount: number;
}

export interface OutputEstimationResponse {
  outputAmount: number;
}
