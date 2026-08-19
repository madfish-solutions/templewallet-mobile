import { WalletKitTypes } from '@reown/walletkit';
import { getSdkError } from '@walletconnect/utils';

import { Account } from 'src/interfaces/account.interfaces';
import { isDefined } from 'src/utils/is-defined';

import { getWcRequestAddress, isSupportedWcMethod } from './evm-request-method.utils';
import { isSupportedWcChain } from './validate-session-proposal';
import { resolveWcSessionRequestApprover } from './wc-account.utils';

export const getSessionRequestRejectReason = (
  request: WalletKitTypes.SessionRequest,
  accounts: Account[],
  selectedAccount?: Account
) => {
  const { method, params } = request.params.request;

  if (!isSupportedWcMethod(method)) {
    return getSdkError('WC_METHOD_UNSUPPORTED');
  }

  if (!isSupportedWcChain(request.params.chainId)) {
    return getSdkError('UNSUPPORTED_CHAINS');
  }

  const approver = resolveWcSessionRequestApprover(accounts, selectedAccount, getWcRequestAddress(method, params));

  if (!isDefined(approver)) {
    return getSdkError('UNSUPPORTED_ACCOUNTS');
  }

  return undefined;
};
