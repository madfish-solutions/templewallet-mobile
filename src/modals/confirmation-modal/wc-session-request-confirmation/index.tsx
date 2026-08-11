import { WalletKitTypes } from '@reown/walletkit';
import { getSdkError } from '@walletconnect/utils';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

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
import { useAccount, useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { parseEvmCaipChainId } from 'src/utils/evm/caip.utils';
import { isDefined } from 'src/utils/is-defined';
import { WcHandler } from 'src/walletconnect/wc-handler';

import { AppMetadataView } from '../app-metadata-view';

import { approveWcSessionRequest } from './approve-session-request';
import { WcSessionRequestConfirmationSelectors } from './selectors';
import { useWcSessionRequestConfirmationStyles } from './styles';

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

const getRequestAddress = (request: WalletKitTypes.SessionRequest): string | undefined => {
  const { method, params } = request.params.request;

  switch (method) {
    case 'eth_sendTransaction':
      return params[0]?.from;
    case 'personal_sign':
    case 'eth_signTypedData':
    case 'eth_signTypedData_v1':
      return params[1];
    case 'eth_signTypedData_v3':
    case 'eth_signTypedData_v4':
      return params[0];
    default:
      return undefined;
  }
};

export const WcSessionRequestConfirmation: FC<Props> = ({ request }) => {
  const styles = useWcSessionRequestConfirmationStyles();
  const { goBack } = useNavigation();
  const accounts = useAllAccounts();
  const selectedAccount = useAccount();
  const [peerMetadata, setPeerMetadata] = useState<WalletKitTypes.Metadata>();

  const { confirmRequest, isLoading, isConfirmed } = useRequestConfirmation(approveWcSessionRequest);

  const requestChainId = useMemo(() => parseEvmCaipChainId(request.params.chainId), [request.params.chainId]);
  const requestChain = useEvmChain(requestChainId ?? -1);
  const network = useMemo(
    () => (isDefined(requestChain) ? toEvmNetworkEssentials(requestChain) : undefined),
    [requestChain]
  );

  const requestAddress = useMemo(() => getRequestAddress(request)?.toLowerCase(), [request]);
  const approver = useMemo(() => {
    if (isDefined(requestAddress)) {
      return accounts.find(account => getAccountAddressForEvm(account)?.toLowerCase() === requestAddress);
    }

    return getAccountAddressForEvm(selectedAccount) ? selectedAccount : accounts.find(getAccountAddressForEvm);
  }, [accounts, requestAddress, selectedAccount]);

  const approverAddress = useMemo(
    () => (isDefined(approver) ? getAccountAddressForEvm(approver) : undefined),
    [approver]
  );

  const payloadText = useMemo(
    () =>
      JSON.stringify(
        {
          method: request.params.request.method,
          chainId: request.params.chainId,
          params: request.params.request.params
        },
        null,
        2
      ),
    [request]
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

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Confirm action" /> }, []);

  const onConfirm = () => {
    if (!isDefined(approverAddress)) {
      return;
    }

    confirmRequest({
      request,
      address: approverAddress,
      network,
      chainName: requestChain?.name,
      blockExplorerUrl: requestChain?.activeBlockExplorer.url,
      markResponded: () => {
        isConfirmed.current = true;
      }
    });
  };

  return (
    <>
      <ScreenContainer>
        <AppMetadataView
          name={peerMetadata?.name ?? 'Unknown dApp'}
          iconUri={peerMetadata?.icons[0]}
          iconSeed={peerMetadata?.url || peerMetadata?.name || request.topic}
        />
        <Divider />
        <Label label="Account" />
        <Divider />
        {isDefined(approver) ? (
          <AccountDropdownItem account={approver} />
        ) : (
          <Text style={styles.payloadText}>{requestAddress}</Text>
        )}
        <Divider />
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>Request payload</Text>
        </View>
        <Divider size={formatSize(16)} />
        <Text style={styles.payloadText}>{payloadText}</Text>
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
          disabled={isLoading || !isDefined(approverAddress)}
          onPress={onConfirm}
          testID={WcSessionRequestConfirmationSelectors.confirmButton}
        />
      </ModalButtonsFloatingContainer>
    </>
  );
};
