export interface QuoteResponse {
  baseCurrencyAmount: number;
  quoteCurrencyAmount: number;
  extraFeeAmount: number;
  extraFeePercentage: number;
  feeAmount: number;
  networkFeeAmount: number;
  totalAmount: number;
}
