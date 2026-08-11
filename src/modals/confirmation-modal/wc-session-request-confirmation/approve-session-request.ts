import { WalletKitTypes } from '@reown/walletkit';
import { getInternalError, getSdkError } from '@walletconnect/utils';
import { defer, EMPTY, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Hash, isHash } from 'viem';

import { navigateBackAction } from 'src/store/root-state.actions';
import { showSuccessToast } from 'src/toast/toast.utils';
import { EvmNetworkEssentials } from 'src/types/networks';
import { WcEvmRequestError } from 'src/utils/evm/wc-evm-request-error';
import { isDefined } from 'src/utils/is-defined';
import { getViemPublicClient } from 'src/utils/rpc/evm-client.utils';
import { wcEvmRequestService } from 'src/walletconnect/evm-request-service';
import { WcHandler } from 'src/walletconnect/wc-handler';

interface ApproveWcSessionRequestPayload {
  request: WalletKitTypes.SessionRequest;
  address: HexString;
  network?: EvmNetworkEssentials;
  chainName?: string;
  blockExplorerUrl?: string;
  /**
   * Called after any WC response is sent so unmount cleanup does not send a duplicate rejection.
   */
  markResponded: EmptyFn;
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

const getTransactionExplorerUrl = (blockExplorerUrl: string, hash: Hash) => `${blockExplorerUrl}/tx/${hash}`;

const showWcRequestSuccessToast = (method: string, result: unknown, blockExplorerUrl?: string) => {
  switch (method) {
    case 'eth_sendTransaction': {
      if (typeof result === 'string' && isHash(result) && isDefined(blockExplorerUrl)) {
        showSuccessToast({
          title: 'Success!',
          description: 'Transaction request sent! Confirming...',
          operationHash: result,
          operationUrl: getTransactionExplorerUrl(blockExplorerUrl, result)
        });
      } else {
        showSuccessToast({
          title: 'Success!',
          description: 'Transaction request sent! Confirming...'
        });
      }

      return;
    }
    case 'personal_sign':
    case 'eth_signTypedData':
    case 'eth_signTypedData_v1':
    case 'eth_signTypedData_v3':
    case 'eth_signTypedData_v4':
      showSuccessToast({ description: 'Successfully signed!' });

      return;
    case 'eth_accounts':
    case 'eth_requestAccounts':
      showSuccessToast({ description: 'Successfully approved!' });

      return;
    case 'wallet_watchAsset':
      showSuccessToast({ description: 'Successfully added token!' });

      return;
    default:
      showSuccessToast({ description: 'Successfully confirmed!' });
  }
};

const waitForWcTransactionConfirmation = (
  network: EvmNetworkEssentials,
  hash: Hash,
  chainName: string,
  blockExplorerUrl: string
) =>
  from(getViemPublicClient(network).waitForTransactionReceipt({ hash })).pipe(
    tap(receipt => {
      showSuccessToast({
        title: 'Success!',
        description: `${chainName} transaction confirmed`,
        operationHash: receipt.transactionHash,
        operationUrl: getTransactionExplorerUrl(blockExplorerUrl, receipt.transactionHash)
      });
    }),
    catchError(error => {
      console.error(error);

      return EMPTY;
    })
  );

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

export const approveWcSessionRequest = ({
  request,
  address,
  network,
  chainName,
  blockExplorerUrl,
  markResponded
}: ApproveWcSessionRequestPayload) => {
  const { method, params } = request.params.request;

  return defer(() => from(wcEvmRequestService.handle({ method, params, address, network }))).pipe(
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
            method === 'eth_sendTransaction' &&
            typeof result === 'string' &&
            isHash(result) &&
            isDefined(network) &&
            isDefined(chainName) &&
            isDefined(blockExplorerUrl)
          ) {
            waitForWcTransactionConfirmation(network, result, chainName, blockExplorerUrl).subscribe();
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
