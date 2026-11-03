import React, { useCallback, useMemo } from 'react';

import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { useBridgeAccountAddresses } from 'src/hooks/use-bridge-account-addresses.hook';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useAccount } from 'src/store/wallet/wallet-selectors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { buildFastWithdrawRequest } from 'src/utils/etherlink-bridge/fast-withdrawal';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { ConfirmationLayout } from '../common/confirmation-layout/confirmation-layout';
import { EvmTransactionFeeDetails } from '../common/evm-transaction-fee-details';
import { useEvmConfirmAction } from '../common/hooks/use-evm-confirm-action';
import { useEvmTransactionSubmission } from '../common/hooks/use-evm-transaction-submission';
import { ConfirmationModalSelectors } from '../confirmation-modal.selectors';

import { BridgePreview } from './bridge-preview';

interface Props {
  amountMutez: string;
  receiveMutez: string;
  feeRate: string;
}

const renderHeaderTitle = () => <HeaderTitle title="Confirm Bridge" />;

export const BridgeWithdrawConfirmation = ({ amountMutez, receiveMutez, feeRate }: Props) => {
  const { goBack } = useNavigation();
  const { trackEvent } = useAnalytics();
  const account = useAccount();
  const addresses = useBridgeAccountAddresses();

  if (!addresses) {
    throw new DeadEndBoundaryError();
  }

  const { tezosAddress, evmAddress } = addresses;

  const confirmEventProperties = useMemo(
    () => ({ direction: 'withdraw', amount: amountMutez, feeRate }),
    [amountMutez, feeRate]
  );

  const handleConfirm = useCallback(
    () => trackEvent('BRIDGE_TRANSACTION_SENT', AnalyticsEventCategory.FormSubmit, confirmEventProperties),
    [trackEvent, confirmEventProperties]
  );

  const request = useMemo(
    () => buildFastWithdrawRequest(tezosAddress, BigInt(amountMutez), BigInt(receiveMutez)),
    [tezosAddress, amountMutez, receiveMutez]
  );
  const feeState = useEvmTransactionFee({ chainId: ETHERLINK_MAINNET_CHAIN_ID, sourceAddress: evmAddress, request });
  const { isSubmitting, submit } = useEvmTransactionSubmission({
    chainId: ETHERLINK_MAINNET_CHAIN_ID,
    sourceAddress: evmAddress,
    request
  });
  const confirmAction = useEvmConfirmAction({ feeState, isSubmitting, submit, onConfirm: handleConfirm });

  useNavigationSetOptions({ headerTitle: renderHeaderTitle }, []);

  return (
    <ConfirmationLayout
      account={account}
      accountChainKind={TempleChainKind.EVM}
      preview={
        <BridgePreview
          direction="withdraw"
          amountMutez={amountMutez}
          receiveMutez={receiveMutez}
          feeRate={feeRate}
          sourceAddress={evmAddress}
          destinationAddress={tezosAddress}
        />
      }
      details={<EvmTransactionFeeDetails feeState={feeState} />}
      backAction={{ disabled: isSubmitting, onPress: goBack }}
      confirmAction={{
        ...confirmAction,
        testID: ConfirmationModalSelectors.confirmButton,
        testIDProperties: confirmEventProperties
      }}
    />
  );
};
