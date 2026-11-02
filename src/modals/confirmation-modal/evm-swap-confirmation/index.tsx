import React, { FC, useEffect } from 'react';
import { Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { HeaderCloseButton } from 'src/components/header/header-close-button/header-close-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { emptyComponent } from 'src/config/general';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { EvmSwapDetails } from 'src/screens/swap/evm-swap-form/evm-swap-details';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { ConfirmationLayout } from '../common/confirmation-layout/confirmation-layout';
import { EvmTransactionFeeDetails } from '../common/evm-transaction-fee-details';
import { OperationPreviewAssetAmounts } from '../common/operation-preview-asset-amounts';
import { OperationPreviewCard } from '../common/operation-preview-card';
import { EvmSwapConfirmationModalParams } from '../confirmation-modal.params';

import { useEvmSwapConfirmation } from './use-evm-swap-confirmation';

const renderClose = () => <HeaderCloseButton />;

const renderTitle = () => <HeaderTitle title="Confirm Etherlink swap" />;

export const EvmSwapConfirmation: FC<EvmSwapConfirmationModalParams> = params => {
  const { goBack, addListener } = useNavigation();
  const colors = useColors();
  const state = useEvmSwapConfirmation(params);
  const { quote, phase } = state;
  const approval = phase === 'approval' || state.pending?.action === 'approval';
  useNavigationSetOptions(
    { headerTitle: renderTitle, headerRight: state.busy ? emptyComponent : renderClose, gestureEnabled: !state.busy },
    [state.busy]
  );
  const canClose = state.canClose;
  useEffect(
    () =>
      addListener('beforeRemove', event => {
        if (!canClose()) event.preventDefault();
      }),
    [addListener, canClose]
  );

  return (
    <ConfirmationLayout
      account={state.account}
      accountChainKind={TempleChainKind.EVM}
      preview={
        <OperationPreviewCard
          iconSeed={quote.route.txDestination}
          description={approval ? 'Approve token for 3Route' : '3Route swap router'}
          publicKeyHash={quote.route.txDestination}
        >
          <Divider size={formatSize(8)} />
          <OperationPreviewAssetAmounts
            asset={params.input}
            amount={quote.route.fromAmount}
            showMinusSign={!approval}
            showDollar={params.input.exchangeRate !== undefined}
          />
          {!approval && (
            <>
              <Divider size={formatSize(12)} />
              <OperationPreviewAssetAmounts
                asset={params.output}
                amount={quote.route.toAmount}
                showDollar={params.output.exchangeRate !== undefined}
              />
            </>
          )}
        </OperationPreviewCard>
      }
      details={
        <>
          <EvmSwapDetails quote={quote} input={params.input} output={params.output} />
          {!state.pending && !state.confirmedHash && (phase === 'approval' || phase === 'swap') && (
            <EvmTransactionFeeDetails feeState={state.feeState} />
          )}
          {approval && (
            <Text style={{ color: colors.black }}>
              Approval permits the router to spend the exact input amount. The swap requires a separate confirmation.
            </Text>
          )}
          {phase === 'allowance' && !state.error && (
            <Text style={{ color: colors.black }}>Read the token allowance.</Text>
          )}
          {!state.validAccount && (
            <Text style={{ color: colors.black }}>The selected account changed. Return to the swap form.</Text>
          )}
          {state.pending && (
            <Text selectable style={{ color: colors.black }}>
              Transaction sent. Receipt status: {state.pending.hash}
            </Text>
          )}
          {!!state.confirmedHash && (
            <Text selectable style={{ color: colors.black }}>
              Swap confirmed: {state.confirmedHash}
            </Text>
          )}
          {!!state.approvalHash && (
            <Text selectable style={{ color: colors.black }}>
              Approval confirmed: {state.approvalHash}
            </Text>
          )}
          {!!state.notice && <Text style={{ color: colors.black }}>{state.notice}</Text>}
          {!!state.error && <Text style={{ color: colors.black }}>{state.error}</Text>}
        </>
      }
      backAction={{ disabled: state.busy, onPress: goBack }}
      confirmAction={{
        title: state.title,
        disabled: state.disabled,
        isLoading: state.busy,
        onPress: state.confirmedHash && !state.error ? goBack : state.confirm,
        testID: 'EvmSwap/Confirm'
      }}
    />
  );
};
