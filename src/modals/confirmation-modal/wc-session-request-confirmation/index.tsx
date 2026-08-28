import { WalletKitTypes } from '@reown/walletkit';
import { getSdkError } from '@walletconnect/utils';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { SendTransactionRequest } from 'viem';

import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useRequestConfirmation } from 'src/hooks/request-confirmation/use-request-confirmation.hook';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useAccount, useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { toEvmNetworkEssentials } from 'src/types/networks';
import {
  isStrictWcSigningRequestContent,
  isWcSendTransactionRequestContent,
  isWcWatchAssetRequestContent,
  StrictWcSessionRequest
} from 'src/types/strict-wc-session-request';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { assert } from 'src/utils/assert.utils';
import { parseEvmCaipChainId } from 'src/utils/evm/caip.utils';
import { isDefined } from 'src/utils/is-defined';
import { getWcRequestAddress } from 'src/walletconnect/evm-request-method.utils';
import { resolveWcSessionRequestApprover } from 'src/walletconnect/wc-account.utils';
import { WcHandler } from 'src/walletconnect/wc-handler';

import { AppMetadataView } from '../common/app-metadata-view';
import { ConfirmationLayout } from '../common/confirmation-layout/confirmation-layout';

import { approveWcSessionRequest, ApproveWcSessionRequestPayload } from './approve-session-request';
import { WcSessionRequestConfirmationSelectors } from './selectors';
import { EvmSignRequestConfirmation } from './sign-request-confirmation';
import { useWcSessionRequestConfirmationStyles } from './styles';
import { WatchAssetConfirmationContent } from './watch-asset-confirmation-content';
import { WcSendTransactionConfirmation } from './wc-send-transaction-confirmation';

interface Props {
  request: StrictWcSessionRequest;
}

const rejectWcSessionRequest = (request: StrictWcSessionRequest) =>
  WcHandler.respond({
    topic: request.topic,
    response: {
      id: request.id,
      jsonrpc: '2.0',
      error: getSdkError('USER_REJECTED')
    }
  });

export const WcSessionRequestConfirmation: FC<Props> = ({ request }) => {
  const styles = useWcSessionRequestConfirmationStyles();
  const { goBack } = useNavigation();
  const accounts = useAllAccounts();
  const selectedAccount = useAccount();
  const [peerMetadata, setPeerMetadata] = useState<WalletKitTypes.Metadata>();

  const { confirmRequest, isLoading, isConfirmed } = useRequestConfirmation(approveWcSessionRequest);

  const { request: requestContent, chainId: caipChainId } = request.params;
  const isSigningRequest = isStrictWcSigningRequestContent(requestContent);
  const isSendTransactionRequest = isWcSendTransactionRequestContent(requestContent);
  const isWatchAssetRequest = isWcWatchAssetRequestContent(requestContent);

  const requestChainId = useMemo(() => {
    const chainId = parseEvmCaipChainId(caipChainId);

    assert(chainId, 'WC session request chain is expected to be supported before opening the confirmation modal');

    return chainId;
  }, [caipChainId]);
  const requestChain = useEvmChain(requestChainId);
  const network = useMemo(
    () => (isDefined(requestChain) ? toEvmNetworkEssentials(requestChain) : undefined),
    [requestChain]
  );

  const approver = useMemo(() => {
    const resolved = resolveWcSessionRequestApprover(accounts, selectedAccount, getWcRequestAddress(requestContent));

    assert(resolved, 'WC session request approver is expected to be resolved before opening the confirmation modal');

    return resolved;
  }, [accounts, requestContent, selectedAccount]);

  const approverAddress = useMemo(() => getAccountAddressForEvm(approver), [approver]);
  const knownAssets = useEvmAccountChainAssetsSelector(approverAddress, requestChainId);

  const appName = peerMetadata?.name || peerMetadata?.url || 'Unknown dApp';
  const iconUri = peerMetadata?.icons[0];
  const iconSeed = peerMetadata?.url || peerMetadata?.name || request.topic;

  const genericPayload = useMemo(
    () =>
      JSON.stringify(
        {
          ...requestContent,
          chainId: request.params.chainId
        },
        null,
        2
      ),
    [requestContent, request.params.chainId]
  );

  useEffect(() => {
    void WcHandler.getActiveSessions().then(sessions => {
      setPeerMetadata(sessions[request.topic]?.peer.metadata);
    });
  }, [request.topic]);

  useEffect(
    () => () => {
      if (!isConfirmed.current) {
        void rejectWcSessionRequest(request).catch(error => {
          console.error(error);
        });
      }
    },
    [request, isConfirmed]
  );

  let title: string;
  if (isSigningRequest) {
    title = 'Confirm Sign';
  } else if (isSendTransactionRequest) {
    title = 'Confirm Operation';
  } else if (isWatchAssetRequest) {
    title = 'Confirm Adding Token';
  } else {
    title = 'Confirm Action';
  }

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title={title} /> }, [title]);

  const onConfirm = useCallback(
    (preparedTransaction?: SendTransactionRequest) => {
      confirmRequest({
        request,
        address: approverAddress,
        network,
        chainName: requestChain?.name,
        blockExplorerUrl: requestChain?.activeBlockExplorer.url,
        knownAssets,
        preparedTransaction,
        markResponded: () => {
          isConfirmed.current = true;
        }
      } as ApproveWcSessionRequestPayload);
    },
    [
      approverAddress,
      confirmRequest,
      isConfirmed,
      knownAssets,
      network,
      request,
      requestChain?.activeBlockExplorer.url,
      requestChain?.name
    ]
  );

  if (isSigningRequest) {
    return (
      <EvmSignRequestConfirmation
        headerTitle="Confirm Sign"
        appName={appName}
        iconUri={iconUri}
        iconSeed={iconSeed}
        account={approver}
        requestContent={requestContent}
        isLoading={isLoading}
        cancelTestID={WcSessionRequestConfirmationSelectors.cancelButton}
        confirmTestID={WcSessionRequestConfirmationSelectors.confirmButton}
        onCancel={goBack}
        onConfirm={onConfirm}
      />
    );
  }

  if (isSendTransactionRequest) {
    return (
      <WcSendTransactionConfirmation
        requestContent={requestContent}
        chainId={requestChainId}
        account={approver}
        accountAddress={approverAddress}
        appName={appName}
        iconUri={iconUri}
        iconSeed={iconSeed}
        isSubmitting={isLoading}
        onConfirm={onConfirm}
      />
    );
  }

  if (isWatchAssetRequest) {
    return (
      <WatchAssetConfirmationContent
        requestContent={requestContent}
        chainId={requestChainId}
        isLoading={isLoading}
        onCancel={goBack}
        onConfirm={onConfirm}
      />
    );
  }

  return (
    <ConfirmationLayout
      account={approver}
      accountChainKind={TempleChainKind.EVM}
      preview={<Text style={styles.payloadText}>{genericPayload}</Text>}
      headerContent={<AppMetadataView name={appName} iconUri={iconUri} iconSeed={iconSeed} />}
      backAction={{
        disabled: isLoading,
        onPress: goBack,
        testID: WcSessionRequestConfirmationSelectors.cancelButton
      }}
      confirmAction={{
        disabled: isLoading,
        onPress: onConfirm,
        testID: WcSessionRequestConfirmationSelectors.confirmButton
      }}
    />
  );
};
