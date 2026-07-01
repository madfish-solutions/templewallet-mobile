import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import React, { FC, useCallback, useRef } from 'react';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { everstakeApi } from 'src/api.service';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { ApproveInternalOperationRequestActionPayloadInterface } from 'src/hooks/request-confirmation/approve-internal-operation-request-action-payload.interface';
import { useRequestConfirmation } from 'src/hooks/request-confirmation/use-request-confirmation.hook';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { dispatch } from 'src/store';
import { navigateAction } from 'src/store/root-state.actions';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { waitForOperationCompletionAction } from 'src/store/wallet/wallet-actions';
import { useAccount } from 'src/store/wallet/wallet-selectors';
import { showSuccessToast } from 'src/toast/toast.utils';
import { getAccountForTezos } from 'src/utils/account.utils.ts';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { TEMPLE_WALLET_EVERSTAKE_LINK_ID } from 'src/utils/env.utils';
import { isDefined } from 'src/utils/is-defined';
import { isTooLowTezBalanceError } from 'src/utils/is-too-low-tez-balance-error';
import { isTruthy } from 'src/utils/is-truthy';
import { EVERSTAKE_BAKER_ADDRESS } from 'src/utils/known-bakers';
import { sendTransaction$ } from 'src/utils/wallet.utils';

import { InternalOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { OperationsConfirmation } from '../operations-confirmation/operations-confirmation';

type Props = Omit<InternalOperationsConfirmationModalParams, 'type'> & {
  renderPreview?: (opParams: ParamsWithKind[]) => React.ReactNode;
  onEstimationComplete?: EmptyFn;
};

const approveInternalOperationRequest = ({ sender, opParams }: ApproveInternalOperationRequestActionPayloadInterface) =>
  sendTransaction$(sender.address, opParams).pipe(
    switchMap(({ hash }) =>
      opParams[0]?.kind === OpKind.DELEGATION && opParams[0]?.delegate === EVERSTAKE_BAKER_ADDRESS
        ? of(
            everstakeApi.post('/delegations', {
              link_id: TEMPLE_WALLET_EVERSTAKE_LINK_ID,
              delegations: [hash]
            })
          ).pipe(map(() => hash))
        : of(hash)
    ),
    switchMap(hash => {
      showSuccessToast({
        operationHash: hash,
        description: 'Transaction request sent! Confirming...',
        title: 'Success!'
      });

      return [
        navigateAction({ screen: StacksEnum.MainStack }),
        waitForOperationCompletionAction({ opHash: hash, sender })
      ];
    })
  );

export const InternalOperationsConfirmation: FC<Props> = ({
  opParams,
  modalTitle,
  disclaimerMessage,
  testID,
  renderPreview,
  onEstimationComplete
}) => {
  const account = useAccount();
  const tezosAccount = getAccountForTezos(account);

  if (!account || !tezosAccount) {
    throw new DeadEndBoundaryError();
  }

  const lastSetOverlayStateRef = useRef<OnRampOverlayState | null>(null);
  const { trackErrorEvent } = useAnalytics();

  const { confirmRequest, isLoading } = useRequestConfirmation(approveInternalOperationRequest);

  useNavigationSetOptions(
    {
      headerTitle: () => {
        switch (opParams[0]?.kind) {
          case OpKind.DELEGATION:
            return <HeaderTitle title="Confirm Delegate" />;
          case OpKind.TRANSACTION:
            return <HeaderTitle title={isDefined(modalTitle) ? modalTitle : 'Confirm Send'} />;
          default:
            return <HeaderTitle title="Confirm Operation" />;
        }
      }
    },
    []
  );

  const disclaimer = isTruthy(disclaimerMessage) ? (
    <Disclaimer title="Disclaimer" texts={[disclaimerMessage]} />
  ) : undefined;

  const updateOverlayState = useCallback((newState: OnRampOverlayState) => {
    if (lastSetOverlayStateRef.current !== newState) {
      lastSetOverlayStateRef.current = newState;
      dispatch(setOnRampOverlayStateAction(newState));
    }
  }, []);

  const handleEstimationError = useCallback(
    (error: unknown) => {
      if (!LIMIT_FIN_FEATURES && isTooLowTezBalanceError(error)) {
        updateOverlayState(OnRampOverlayState.Continue);
      } else {
        console.error(error);

        trackErrorEvent(
          'InternalOperationsConfirmationEstimationError',
          error,
          opParams.map(op => ('source' in op ? op.source : tezosAccount.address)).filter(isDefined),
          { opParams, testID }
        );
      }
    },
    [opParams, tezosAccount, testID, trackErrorEvent, updateOverlayState]
  );

  return (
    <OperationsConfirmation
      sender={account}
      opParams={opParams}
      isLoading={isLoading}
      onEstimationError={handleEstimationError}
      onSubmit={newOpParams => confirmRequest({ sender: tezosAccount, opParams: newOpParams })}
      testID={testID}
      disclaimer={disclaimer}
      renderPreview={renderPreview}
      onEstimationComplete={onEstimationComplete}
    />
  );
};
