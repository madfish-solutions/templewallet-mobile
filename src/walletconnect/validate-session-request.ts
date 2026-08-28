import { WalletKitTypes } from '@reown/walletkit';
import { getSdkError } from '@walletconnect/utils';
import { isAddressEqual } from 'viem';

import { Account } from 'src/interfaces/account.interfaces';
import { WalletConnectDAppConnection } from 'src/interfaces/dapp-connection.interface';
import {
  isWcAccountsMethod,
  isWcModernTypedDataMethod,
  isWcOldTypedDataMethod,
  isWcSendTransactionMethod,
  isWcSigningMethod,
  isWcWatchAssetMethod,
  StrictWcSessionRequest
} from 'src/types/strict-wc-session-request';
import {
  validateOldSignTypedDataParams,
  validatePersonalSignParams,
  validateSendTransactionParams,
  validateSignTypedDataParams,
  validateWatchAssetParams
} from 'src/utils/evm/validation-schemas';
import { isDefined } from 'src/utils/is-defined';

import { getWcRequestAddress } from './evm-request-method.utils';
import { isSupportedWcChain } from './validate-session-proposal';
import { resolveWcSessionRequestApprover } from './wc-account.utils';

const makeInvalidRequestError = (message: string) => ({ code: -32602, message });

const withValidatedParams = <T extends StrictWcSessionRequest>(
  request: WalletKitTypes.SessionRequest,
  method: T['params']['request']['method'],
  params: T['params']['request']['params']
): StrictWcSessionRequest => ({ ...request, params: { ...request.params, request: { method, params } } });

const toStrictWcSessionRequest = (request: WalletKitTypes.SessionRequest): StrictWcSessionRequest => {
  const { method, params: originalParams } = request.params.request;

  if (isWcAccountsMethod(method)) {
    return withValidatedParams(request, method, originalParams);
  }

  if (isWcOldTypedDataMethod(method)) {
    return withValidatedParams(request, method, validateOldSignTypedDataParams(originalParams));
  }

  if (isWcModernTypedDataMethod(method)) {
    return withValidatedParams(request, method, validateSignTypedDataParams(originalParams));
  }

  if (isWcSigningMethod(method)) {
    return withValidatedParams(request, method, validatePersonalSignParams(originalParams));
  }

  if (isWcSendTransactionMethod(method)) {
    return withValidatedParams(request, method, validateSendTransactionParams(originalParams));
  }

  if (isWcWatchAssetMethod(method)) {
    return withValidatedParams(request, method, validateWatchAssetParams(originalParams));
  }

  throw getSdkError('WC_METHOD_UNSUPPORTED');
};

export const validateSessionRequest = (
  request: WalletKitTypes.SessionRequest,
  wcSession: WalletConnectDAppConnection | undefined,
  accounts: Account[],
  selectedAccount?: Account
): StrictWcSessionRequest => {
  if (!isSupportedWcChain(request.params.chainId)) {
    throw getSdkError('UNSUPPORTED_CHAINS');
  }

  const validatedRequest = toStrictWcSessionRequest(request);

  const requestAddress = getWcRequestAddress(validatedRequest.params.request);

  if (!wcSession) {
    throw makeInvalidRequestError('Please approve the connection first');
  }

  if (!wcSession.chains.includes(request.params.chainId)) {
    throw makeInvalidRequestError('Trying to use a different chain');
  }

  if (requestAddress && !isAddressEqual(wcSession.accountAddress! as HexString, requestAddress as HexString)) {
    throw makeInvalidRequestError('Trying to use a different account');
  }

  const approver = resolveWcSessionRequestApprover(
    accounts,
    selectedAccount,
    getWcRequestAddress(validatedRequest.params.request)
  );

  if (!isDefined(approver)) {
    throw getSdkError('UNSUPPORTED_ACCOUNTS');
  }

  return validatedRequest;
};
