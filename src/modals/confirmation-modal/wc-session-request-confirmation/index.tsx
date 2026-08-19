import { WalletKitTypes } from '@reown/walletkit';
import { getSdkError } from '@walletconnect/utils';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { SendTransactionRequest } from 'viem';

import { AccountDropdownItem } from 'src/components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useRequestConfirmation } from 'src/hooks/request-confirmation/use-request-confirmation.hook';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useAccount, useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { assert } from 'src/utils/assert.utils';
import { parseEvmCaipChainId } from 'src/utils/evm/caip.utils';
import { isDefined } from 'src/utils/is-defined';
import {
  getWcRequestAddress,
  isWcSendTransactionMethod,
  isWcSigningMethod
} from 'src/walletconnect/evm-request-method.utils';
import { getWcSigningPayloadPreview } from 'src/walletconnect/get-wc-signing-payload-preview';
import { resolveWcSessionRequestApprover } from 'src/walletconnect/wc-account.utils';
import { WcHandler } from 'src/walletconnect/wc-handler';

import { AppMetadataView } from '../common/app-metadata-view';
import { SignRequestConfirmationContent } from '../common/sign-request-confirmation-content';

import { approveWcSessionRequest } from './approve-session-request';
import { WcSessionRequestConfirmationSelectors } from './selectors';
import { useWcSessionRequestConfirmationStyles } from './styles';
import { WcSendTransactionConfirmation } from './wc-send-transaction-confirmation';

interface Props {
  request: WalletKitTypes.SessionRequest;
}

const rejectWcSessionRequest = (request: WalletKitTypes.SessionRequest) =>
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

  const { method, params } = request.params.request;
  const isSigningRequest = isWcSigningMethod(method);
  const isSendTransactionRequest = isWcSendTransactionMethod(method);

  const requestChainId = useMemo(() => {
    const chainId = parseEvmCaipChainId(request.params.chainId);

    assert(chainId, 'WC session request chain is expected to be supported before opening the confirmation modal');

    return chainId;
  }, [request.params.chainId]);
  const requestChain = useEvmChain(requestChainId);
  const network = useMemo(
    () => (isDefined(requestChain) ? toEvmNetworkEssentials(requestChain) : undefined),
    [requestChain]
  );

  const approver = useMemo(() => {
    const resolved = resolveWcSessionRequestApprover(accounts, selectedAccount, getWcRequestAddress(method, params));

    assert(resolved, 'WC session request approver is expected to be resolved before opening the confirmation modal');

    return resolved;
  }, [accounts, method, params, selectedAccount]);

  const approverAddress = useMemo(() => getAccountAddressForEvm(approver), [approver]);
  const knownAssets = useEvmAccountChainAssetsSelector(approverAddress, requestChainId);

  const appName = peerMetadata?.name || peerMetadata?.url || 'Unknown dApp';
  const iconUri = peerMetadata?.icons[0];
  const iconSeed = peerMetadata?.url || peerMetadata?.name || request.topic;

  const payloadPreview = useMemo(
    () => (isSigningRequest ? getWcSigningPayloadPreview(method, params) : undefined),
    [isSigningRequest, method, params]
  );
  const bytesPayload = useMemo(
    () => (isSigningRequest && method === 'personal_sign' && !isDefined(payloadPreview) ? params[0] : undefined),
    [isSigningRequest, method, params, payloadPreview]
  );

  const genericPayload = useMemo(
    () =>
      JSON.stringify(
        {
          method,
          chainId: request.params.chainId,
          params
        },
        null,
        2
      ),
    [method, params, request.params.chainId]
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

  useNavigationSetOptions(
    {
      headerTitle: () => (
        <HeaderTitle
          title={isSigningRequest ? 'Confirm Sign' : isSendTransactionRequest ? 'Confirm Operation' : 'Confirm action'}
        />
      )
    },
    [isSendTransactionRequest, isSigningRequest]
  );

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
      });
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
      <SignRequestConfirmationContent
        headerTitle="Confirm Sign"
        appName={appName}
        iconUri={iconUri}
        iconSeed={iconSeed}
        account={approver}
        payload={payloadPreview}
        bytesPayload={bytesPayload}
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
        params={params}
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

  return (
    <>
      <ScreenContainer>
        <AppMetadataView name={appName} iconUri={iconUri} iconSeed={iconSeed} />
        <Divider />
        <Label label="Account" />
        <Divider />
        <AccountDropdownItem account={approver} />
        <Divider />
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>Request payload</Text>
        </View>
        <Divider size={formatSize(16)} />
        <Text style={styles.payloadText}>{genericPayload}</Text>
      </ScreenContainer>
      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary
          title="Cancel"
          disabled={isLoading}
          onPress={goBack}
          testID={WcSessionRequestConfirmationSelectors.cancelButton}
        />
        <ButtonLargePrimary
          title="Confirm"
          disabled={isLoading}
          onPress={onConfirm}
          testID={WcSessionRequestConfirmationSelectors.confirmButton}
        />
      </ModalButtonsFloatingContainer>
    </>
  );
};
