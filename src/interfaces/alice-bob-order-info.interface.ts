import { AliceBobOrderStatusEnum } from 'src/enums/alice-bob-order-status.enum';

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
  side: 'SELL' | 'BUY';
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
