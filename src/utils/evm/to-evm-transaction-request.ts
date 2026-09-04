import { omit } from 'lodash-es';

import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';

import { ParsedEvmRpcTransactionRequest } from './parse-rpc-transaction-request';

/** Maps a WalletConnect/RPC-parsed transaction into estimation/submission request fields. */
export const toEvmTransactionRequest = (request: ParsedEvmRpcTransactionRequest): EvmTransactionRequest =>
  omit(request, 'nonce');
