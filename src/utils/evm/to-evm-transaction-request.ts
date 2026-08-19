import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';
import { isDefined } from 'src/utils/is-defined';

import { ParsedEvmRpcTransactionRequest } from './parse-rpc-transaction-request';

/** Maps a WalletConnect/RPC-parsed transaction into estimation/submission request fields. */
export const toEvmTransactionRequest = (parsed: ParsedEvmRpcTransactionRequest): EvmTransactionRequest => ({
  to: parsed.to,
  value: parsed.value,
  data: parsed.data,
  gas: parsed.gas,
  ...('gasPrice' in parsed && isDefined(parsed.gasPrice) ? { gasPrice: parsed.gasPrice } : {}),
  ...('maxFeePerGas' in parsed && isDefined(parsed.maxFeePerGas) ? { maxFeePerGas: parsed.maxFeePerGas } : {}),
  ...('maxPriorityFeePerGas' in parsed && isDefined(parsed.maxPriorityFeePerGas)
    ? { maxPriorityFeePerGas: parsed.maxPriorityFeePerGas }
    : {})
});
