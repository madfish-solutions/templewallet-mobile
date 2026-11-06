import React, { FC, useEffect } from 'react';

import { HeaderCloseButton } from 'src/components/header/header-close-button/header-close-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { emptyComponent } from 'src/config/general';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { showErrorToast } from 'src/toast/error-toast.utils';

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
  const state = useEvmSwapConfirmation(params);
  const { quote, phase } = state;
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

  const error = !state.validAccount
    ? 'The selected account changed. Return to the swap form.'
    : state.error || state.feeState.estimationError?.message;
  useEffect(() => {
    if (error) showErrorToast({ description: error });
  }, [error]);

  return (
    <ConfirmationLayout
      account={state.account}
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
      details={
        !state.pending &&
        (phase === 'approval' || phase === 'swap') && <EvmTransactionFeeDetails feeState={state.feeState} />
      }
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
