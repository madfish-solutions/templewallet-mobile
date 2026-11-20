import React, { FC, useEffect } from 'react';

import { HeaderCloseButton } from 'src/components/header/header-close-button/header-close-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { emptyComponent } from 'src/config/general';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useAccount } from 'src/store/wallet/wallet-selectors.ts';
import { showErrorToast, showInsufficientGasBalanceToast } from 'src/toast/error-toast.utils';

import { ConfirmationLayout } from '../common/confirmation-layout/confirmation-layout';
import { EvmTransactionFeeDetails } from '../common/evm-transaction-fee-details';
import { EvmSwapConfirmationModalParams } from '../confirmation-modal.params';

import { EvmSwapPreview } from './evm-swap-preview';
import { useEvmSwapConfirmation } from './use-evm-swap-confirmation';

const renderClose = () => <HeaderCloseButton />;

const renderApprovalTitle = () => <HeaderTitle title="Approve" />;
const renderSwapTitle = () => <HeaderTitle title="Confirm Swap" />;

export const EvmSwapConfirmation: FC<EvmSwapConfirmationModalParams> = params => {
  const { goBack, addListener } = useNavigation();
  const account = useAccount();
  const state = useEvmSwapConfirmation(params);
  const { quote, phase, networkName, feeState } = state;
  const approval = phase === 'approval' || state.pending?.action === 'approval';
  useNavigationSetOptions(
    {
      headerTitle: approval ? renderApprovalTitle : renderSwapTitle,
      headerRight: state.busy ? emptyComponent : renderClose,
      gestureEnabled: !state.busy
    },
    [approval, state.busy]
  );
  const canClose = state.canClose;
  useEffect(
    () =>
      addListener('beforeRemove', event => {
        if (!canClose()) event.preventDefault();
      }),
    [addListener, canClose]
  );

  const { estimationError, hasInsufficientNativeBalance } = feeState;
  const isReviewingTransaction = !state.pending && (phase === 'approval' || phase === 'swap');
  const hasInsufficientGasBalance =
    isReviewingTransaction &&
    (estimationError ? estimationError.code === 'insufficient-native-balance' : hasInsufficientNativeBalance);
  const error = state.error || (hasInsufficientGasBalance ? undefined : estimationError?.message);
  useEffect(() => {
    if (error) showErrorToast({ description: error });
    else if (hasInsufficientGasBalance) showInsufficientGasBalanceToast(networkName);
  }, [error, hasInsufficientGasBalance, networkName]);

  return (
    <ConfirmationLayout
      account={account}
      accountChainKind={TempleChainKind.EVM}
      preview={
        <EvmSwapPreview
          asset={params.input}
          amount={quote.route.fromAmount}
          amountUSD={quote.route.fromAmountUSD}
          destination={quote.route.txDestination}
          approval={approval}
        />
      }
      details={isReviewingTransaction && !estimationError && <EvmTransactionFeeDetails feeState={feeState} />}
      backAction={{ disabled: state.busy, onPress: goBack }}
      confirmAction={{
        title: state.title,
        disabled: state.disabled,
        isLoading: state.busy,
        onPress: state.confirm,
        testID: 'EvmSwap/Confirm'
      }}
    />
  );
};
