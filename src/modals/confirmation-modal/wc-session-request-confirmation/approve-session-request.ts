import { WalletKitTypes } from '@reown/walletkit';
import { getInternalError, getSdkError } from '@walletconnect/utils';
import { defer, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Hash, isHash, SendTransactionRequest } from 'viem';

import { EvmChainAssetsRecord } from 'src/store/evm/assets/evm-assets-state';
import { navigateBackAction } from 'src/store/root-state.actions';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { EvmNetworkEssentials } from 'src/types/networks';
import { loadEtherlinkBalancesOnChain } from 'src/utils/evm/etherlink-balances.utils';
import { normalizeEvmTransactionError } from 'src/utils/evm/evm-transaction-error';
import { evmTransactionSubmissionService } from 'src/utils/evm/evm-transaction-submission';
import { getEvmTransactionExplorerUrl } from 'src/utils/evm/get-evm-transaction-explorer-url';
import { WcEvmRequestError } from 'src/utils/evm/wc-evm-request-error';
import { isDefined } from 'src/utils/is-defined';
import {
  isWcAccountsMethod,
  isWcSendTransactionMethod,
  isWcSigningMethod,
  isWcWatchAssetMethod
} from 'src/walletconnect/evm-request-method.utils';
import { wcEvmRequestService } from 'src/walletconnect/evm-request-service';
import { WcHandler } from 'src/walletconnect/wc-handler';

interface ApproveWcSessionRequestPayload {
  request: WalletKitTypes.SessionRequest;
  address: HexString;
  network?: EvmNetworkEssentials;
  chainName?: string;
  blockExplorerUrl?: string;
  knownAssets?: EvmChainAssetsRecord;
  /**
   * Prepared `eth_sendTransaction` payload with wallet-selected gas/fees.
   * When set, broadcast uses the submission service instead of WC fee estimation.
   */
  preparedTransaction?: SendTransactionRequest;
  /**
   * Called after any WC response is sent so unmount cleanup does not send a duplicate rejection.
   */
  markResponded: EmptyFn;
}

interface WaitForWcTransactionConfirmationParams
  extends Required<Omit<ApproveWcSessionRequestPayload, 'request' | 'markResponded' | 'preparedTransaction'>> {
  hash: Hash;
}

const toWcJsonRpcError = (error: unknown) => {
  if (error instanceof WcEvmRequestError) {
    switch (error.code) {
      case 'unsupported-method':
      case 'unsupported-typed-data-version':
        return getSdkError('WC_METHOD_UNSUPPORTED');
      case 'invalid-params':
        return { ...getInternalError('MISSING_OR_INVALID'), message: error.message };
      case 'account-unavailable':
      case 'signer-address-mismatch':
        return getSdkError('UNAUTHORIZED_METHOD');
      default:
        return { ...getInternalError('UNKNOWN_TYPE'), message: error.message };
    }
  }

  return {
    ...getInternalError('UNKNOWN_TYPE'),
    message: error instanceof Error ? error.message : 'Request failed'
  };
};

const showWcRequestSuccessToast = (method: string, result: unknown, blockExplorerUrl?: string) => {
  if (
    isWcSendTransactionMethod(method) &&
    typeof result === 'string' &&
    isHash(result) &&
    isDefined(blockExplorerUrl)
  ) {
    showSuccessToast({
      title: 'Success!',
      description: 'Transaction request sent! Confirming...',
      operationHash: result,
      operationUrl: getEvmTransactionExplorerUrl(blockExplorerUrl, result)
    });
  } else if (isWcSendTransactionMethod(method)) {
    showSuccessToast({
      title: 'Success!',
      description: 'Transaction request sent! Confirming...'
    });
  } else if (isWcSigningMethod(method)) {
    showSuccessToast({ description: 'Successfully signed!' });
  } else if (isWcAccountsMethod(method)) {
    showSuccessToast({ description: 'Successfully approved!' });
  } else if (isWcWatchAssetMethod(method)) {
    showSuccessToast({ description: 'Token successfully added' });
  } else {
    showSuccessToast({ description: 'Successfully confirmed!' });
  }
};

const waitForWcTransactionConfirmation = async ({
  address,
  network,
  chainName,
  blockExplorerUrl,
  knownAssets,
  hash
}: WaitForWcTransactionConfirmationParams): Promise<void> => {
  try {
    const result = await evmTransactionSubmissionService.waitForConfirmation(network, hash);

    if (result.success) {
      showSuccessToast({
        title: 'Success!',
        description: `${chainName} transaction confirmed`,
        operationHash: result.receipt.transactionHash,
        operationUrl: getEvmTransactionExplorerUrl(blockExplorerUrl, result.receipt.transactionHash)
      });

      void loadEtherlinkBalancesOnChain({ network, account: address, knownAssets }).catch(console.error);

      return;
    }

    const { message } = normalizeEvmTransactionError(result.error);

    showErrorToast({ title: `Failed to confirm ${chainName} transaction`, description: message });
  } catch (error) {
    console.error(error);
  }
};

const respondWcSessionRequest = (
  request: WalletKitTypes.SessionRequest,
  response:
    | { id: number; jsonrpc: '2.0'; result: unknown }
    | { id: number; jsonrpc: '2.0'; error: ReturnType<typeof toWcJsonRpcError> },
  markResponded: EmptyFn
) =>
  from(WcHandler.respond({ topic: request.topic, response })).pipe(
    tap(markResponded),
    catchError(respondError => {
      // Still mark responded: the request was handled from the wallet side.
      markResponded();
      console.error(respondError);

      return of(undefined);
    })
  );

const handleWcSessionRequest = ({
  request,
  address,
  network,
  preparedTransaction
}: Pick<ApproveWcSessionRequestPayload, 'request' | 'address' | 'network' | 'preparedTransaction'>) => {
  const { method, params } = request.params.request;

  if (isDefined(preparedTransaction) && isWcSendTransactionMethod(method)) {
    if (!isDefined(network)) {
      return throwError(() => new WcEvmRequestError('invalid-params', 'eth_sendTransaction requires a network'));
    }

    return defer(() =>
      from(
        evmTransactionSubmissionService
          .broadcast({
            network,
            sourceAddress: address,
            transaction: preparedTransaction
          })
          .then(result => {
            if (!result.success) {
              throw result.error;
            }

            return result.transactionHash;
          })
      )
    );
  }

  return defer(() => from(wcEvmRequestService.handle({ method, params, address, network })));
};

export const approveWcSessionRequest = ({
  request,
  address,
  network,
  chainName,
  blockExplorerUrl,
  knownAssets = {},
  preparedTransaction,
  markResponded
}: ApproveWcSessionRequestPayload) => {
  const { method } = request.params.request;

  return handleWcSessionRequest({ request, address, network, preparedTransaction }).pipe(
    switchMap(result =>
      respondWcSessionRequest(
        request,
        {
          id: request.id,
          jsonrpc: '2.0',
          result
        },
        markResponded
      ).pipe(
        tap(() => {
          showWcRequestSuccessToast(method, result, blockExplorerUrl);

          if (
            isWcSendTransactionMethod(method) &&
            typeof result === 'string' &&
            isHash(result) &&
            isDefined(network) &&
            isDefined(chainName) &&
            isDefined(blockExplorerUrl)
          ) {
            void waitForWcTransactionConfirmation({
              address,
              network,
              chainName,
              blockExplorerUrl,
              knownAssets,
              hash: result
            });
          }
        }),
        map(() => navigateBackAction())
      )
    ),
    catchError(error =>
      respondWcSessionRequest(
        request,
        {
          id: request.id,
          jsonrpc: '2.0',
          error: toWcJsonRpcError(error)
        },
        markResponded
      ).pipe(switchMap(() => throwError(() => error)))
    )
  );
};
