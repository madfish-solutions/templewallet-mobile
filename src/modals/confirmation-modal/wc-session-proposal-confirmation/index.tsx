import { WalletKitTypes } from '@reown/walletkit';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { useRequestConfirmation } from 'src/hooks/request-confirmation/use-request-confirmation.hook';
import { navigateBackAction } from 'src/store/root-state.actions';
import { setSelectedAccountIdAction } from 'src/store/wallet/wallet-actions';
import { useAllAccounts, useAccount } from 'src/store/wallet/wallet-selectors';
import { showSuccessToast } from 'src/toast/toast.utils';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { toEvmCaipChainId } from 'src/utils/evm/caip.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';
import { EVM_WC_EVENTS, EVM_WC_METHODS } from 'src/walletconnect/constants';
import { normalizeSessionProposalParams } from 'src/walletconnect/validate-session-proposal';
import { WcHandler } from 'src/walletconnect/wc-handler';
import { disconnectDuplicateWcSessionsForPeer } from 'src/walletconnect/wc-session-dedupe.utils';

import { ConnectionRequestConfirmationContent } from '../common/connection-request-confirmation/connection-request-confirmation-content';
import { ConnectionRequestConfirmationFormValues } from '../common/connection-request-confirmation/form';

import { WcSessionProposalConfirmationSelectors } from './selectors';

interface Props {
  proposal: WalletKitTypes.SessionProposal;
}

interface ApproveWcSessionProposalPayload {
  proposal: WalletKitTypes.SessionProposal;
  address: HexString;
}

const approveWcSessionProposal = ({ proposal, address }: ApproveWcSessionProposalPayload) => {
  const etherlinkCaipChainId = toEvmCaipChainId(ETHERLINK_MAINNET_CHAIN_ID);
  const namespaces = buildApprovedNamespaces({
    proposal: normalizeSessionProposalParams(proposal.params),
    supportedNamespaces: {
      eip155: {
        chains: [etherlinkCaipChainId],
        methods: [...EVM_WC_METHODS],
        events: [...EVM_WC_EVENTS],
        accounts: [`${etherlinkCaipChainId}:${address.toLowerCase()}`]
      }
    }
  });

  return from(disconnectDuplicateWcSessionsForPeer(proposal.params.proposer.metadata, address)).pipe(
    switchMap(() =>
      from(
        WcHandler.approveSession({
          id: proposal.id,
          namespaces
        })
      )
    ),
    map(() => {
      showSuccessToast({ description: 'Successfully approved!' });

      return navigateBackAction();
    })
  );
};

export const WcSessionProposalConfirmation: FC<Props> = ({ proposal }) => {
  const dispatch = useDispatch();
  const accounts = useAllAccounts();
  const selectedAccount = useAccount();
  const evmAccounts = useMemo(() => accounts.filter(account => getAccountAddressForEvm(account)), [accounts]);
  const { metadata } = proposal.params.proposer;

  const { confirmRequest, isLoading, isConfirmed } = useRequestConfirmation(approveWcSessionProposal);

  const formInitialValues = useMemo<ConnectionRequestConfirmationFormValues>(
    () => ({ approver: getAccountAddressForEvm(selectedAccount) ? selectedAccount : evmAccounts[0] }),
    [selectedAccount, evmAccounts]
  );

  useEffect(
    () => () => {
      if (!isConfirmed.current) {
        WcHandler.rejectSession({
          id: proposal.id,
          reason: getSdkError('USER_REJECTED')
        }).catch(error => {
          console.error(error);
        });
      }
    },
    [proposal.id, isConfirmed]
  );

  const onSubmit = ({ approver }: ConnectionRequestConfirmationFormValues) => {
    if (approver.id !== selectedAccount.id) {
      dispatch(setSelectedAccountIdAction(approver.id));
    }

    const address = getAccountAddressForEvm(approver);

    if (!address) {
      return;
    }

    confirmRequest({
      proposal,
      address
    });
  };

  return (
    <ConnectionRequestConfirmationContent
      appName={metadata.name}
      iconUri={metadata.icons?.[0]}
      iconSeed={metadata.url || metadata.name}
      accounts={evmAccounts}
      initialValues={formInitialValues}
      isLoading={isLoading}
      confirmTestID={WcSessionProposalConfirmationSelectors.confirmButton}
      onSubmit={onSubmit}
    />
  );
};
