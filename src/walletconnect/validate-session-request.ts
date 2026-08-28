import { WalletKitTypes } from '@reown/walletkit';
import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { uniq } from 'lodash-es';
import { Address, isAddressEqual } from 'viem';

import { Account } from 'src/interfaces/account.interfaces';
import {
  isWcAccountsMethod,
  isWcModernTypedDataMethod,
  isWcOldTypedDataMethod,
  isWcSendTransactionMethod,
  isWcSigningMethod,
  isWcWatchAssetMethod,
  StrictWcSessionRequest
} from 'src/types/strict-wc-session-request';
import { getAccountAddressForEvm, hasEvmAddress } from 'src/utils/account.utils';
import { parseEvmCaipAccountId, toEvmCaipAccountId } from 'src/utils/evm/caip.utils';
import {
  validateOldSignTypedDataParams,
  validatePersonalSignParams,
  validateSendTransactionParams,
  validateSignTypedDataParams,
  validateWatchAssetParams
} from 'src/utils/evm/validation-schemas';

import { getWcRequestAddress } from './evm-request-method.utils';
import { isSupportedWcChain } from './validate-session-proposal';

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
  wcSession: SessionTypes.Struct | undefined,
  accounts: Account[]
): StrictWcSessionRequest => {
  const evmAccounts = accounts.filter(hasEvmAddress);

  if (!isSupportedWcChain(request.params.chainId)) {
    throw getSdkError('UNSUPPORTED_CHAINS');
  }

  const validatedRequest = toStrictWcSessionRequest(request);

  const requestAddress = getWcRequestAddress(validatedRequest.params.request);

  if (!wcSession) {
    throw makeInvalidRequestError('Please approve the connection first');
  }

  const { accounts: sessionCaipAccounts, chains: sessionChains = [] } = wcSession.namespaces.eip155;
  const sessionAddresses = uniq(sessionCaipAccounts.map(caipAccount => parseEvmCaipAccountId(caipAccount)![1]));

  if (
    requestAddress &&
    !sessionCaipAccounts.includes(toEvmCaipAccountId(request.params.chainId, requestAddress as Address))
  ) {
    throw makeInvalidRequestError('Trying to use a different account-chain pair');
  }

  if (!sessionChains.includes(request.params.chainId)) {
    throw makeInvalidRequestError('Trying to use a different chain');
  }

  const isKnownAccount = evmAccounts.some(account =>
    sessionAddresses.some(address => isAddressEqual(getAccountAddressForEvm(account), address))
  );

  if (!isKnownAccount) {
    throw getSdkError('UNSUPPORTED_ACCOUNTS');
  }

  return validatedRequest;
};
