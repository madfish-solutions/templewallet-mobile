import { OpKind } from '@taquito/taquito';
import React, { FC, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { everstakeApi } from 'src/api.service';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { ApproveInternalOperationRequestActionPayloadInterface } from 'src/hooks/request-confirmation/approve-internal-operation-request-action-payload.interface';
import { useRequestConfirmation } from 'src/hooks/request-confirmation/use-request-confirmation.hook';
import { useCanUseOnRamp } from 'src/hooks/use-can-use-on-ramp.hook';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { waitForOperationCompletionAction } from 'src/store/wallet/wallet-actions';
import { useRawCurrentAccountSelector } from 'src/store/wallet/wallet-selectors';
import { showSuccessToast } from 'src/toast/toast.utils';
import { TEMPLE_WALLET_EVERSTAKE_LINK_ID } from 'src/utils/env.utils';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { RECOMMENDED_BAKER_ADDRESS } from 'src/utils/known-bakers';
import { sendTransaction$ } from 'src/utils/wallet.utils';

import { InternalOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { OperationsConfirmation } from '../operations-confirmation/operations-confirmation';

const NOT_ENOUGH_TEZ_ESTIMATION_ERRORS_KEYWORDS = [
  'empty_implicit_contract',
  'empty_implicit_delegated_contract',
  'storage_exhausted'
];

const isTezBalanceTooLowError = (error: string, senderPkh: string): boolean => {
  /* An example of matching value: `HttpResponseError: Http error response: (500) [
    {"kind":"temporary","id":"proto.018-Proxford.contract.balance_too_low","contract":"tz1dmR1BEyVW8fYyHT4QjarrRXyMJ1F4DciT","balance":"20","amount":"374"},
    {"kind":"temporary","id":"proto.018-Proxford.tez.subtraction_underflow","amounts":["20","374"]}]`
  */

  if (!error.startsWith('HttpResponseError') || !error.includes('balance_too_low')) {
    return false;
  }

  const firstLine = error.split('\n')[0];
  const rawResponseBody = firstLine.slice(firstLine.indexOf(')') + 1).trim();
  try {
    const responseBody = JSON.parse(rawResponseBody);

    return (
      Array.isArray(responseBody) &&
      responseBody.some(({ id, contract }) => id.includes('balance_too_low') && contract === senderPkh)
    );
  } catch (e) {
    return false;
  }
};

type Props = Omit<InternalOperationsConfirmationModalParams, 'type'>;

const approveInternalOperationRequest = ({
  rpcUrl,
  sender,
  opParams
}: ApproveInternalOperationRequestActionPayloadInterface) =>
  sendTransaction$(rpcUrl, sender.publicKeyHash, opParams).pipe(
    switchMap(({ hash }) =>
      opParams[0]?.kind === OpKind.DELEGATION && opParams[0]?.delegate === RECOMMENDED_BAKER_ADDRESS
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

      return [navigateAction(StacksEnum.MainStack), waitForOperationCompletionAction({ opHash: hash, sender })];
    })
  );

export const InternalOperationsConfirmation: FC<Props> = ({ opParams, modalTitle, disclaimerMessage, testID }) => {
  const canUseOnRamp = useCanUseOnRamp();
  const dispatch = useDispatch();
  const selectedAccount = useRawCurrentAccountSelector();
  const rpcUrl = useSelectedRpcUrlSelector();
  const lastSetOverlayStateRef = useRef<OnRampOverlayState | null>(null);

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

  const updateOverlayState = useCallback(
    (newState: OnRampOverlayState) => {
      if (lastSetOverlayStateRef.current !== newState) {
        lastSetOverlayStateRef.current = newState;
        dispatch(setOnRampOverlayStateAction(newState));
      }
    },
    [dispatch]
  );

  const handleEstimationError = useCallback(
    (error: string) =>
      canUseOnRamp &&
      (NOT_ENOUGH_TEZ_ESTIMATION_ERRORS_KEYWORDS.some(keyword => error.includes(keyword)) ||
        isTezBalanceTooLowError(error, selectedAccount!.publicKeyHash))
        ? updateOverlayState(OnRampOverlayState.Continue)
        : console.error(error),
    [canUseOnRamp, selectedAccount, updateOverlayState]
  );

  return (
    <>
      {isDefined(selectedAccount) && (
        <OperationsConfirmation
          sender={selectedAccount}
          opParams={opParams}
          isLoading={isLoading}
          onEstimationError={handleEstimationError}
          onSubmit={newOpParams => confirmRequest({ rpcUrl, sender: selectedAccount, opParams: newOpParams })}
          testID={testID}
          disclaimer={disclaimer}
        />
      )}
    </>
  );
};
