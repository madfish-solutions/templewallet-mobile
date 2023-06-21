import { OpKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { OnRampOverlay } from 'src/screens/wallet/on-ramp-overlay/on-ramp-overlay';
import { setOnRampPossibilityAction } from 'src/store/settings/settings-actions';
import { isTruthy } from 'src/utils/is-truthy';

import { everstakeApi } from '../../../api.service';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { ApproveInternalOperationRequestActionPayloadInterface } from '../../../hooks/request-confirmation/approve-internal-operation-request-action-payload.interface';
import { useRequestConfirmation } from '../../../hooks/request-confirmation/use-request-confirmation.hook';
import { StacksEnum } from '../../../navigator/enums/stacks.enum';
import { navigateAction } from '../../../store/root-state.actions';
import { useSelectedRpcUrlSelector } from '../../../store/settings/settings-selectors';
import { waitForOperationCompletionAction } from '../../../store/wallet/wallet-actions';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector
} from '../../../store/wallet/wallet-selectors';
import { showSuccessToast } from '../../../toast/toast.utils';
import { TEMPLE_WALLET_EVERSTAKE_LINK_ID } from '../../../utils/env.utils';
import { isDefined } from '../../../utils/is-defined';
import { sendTransaction$ } from '../../../utils/wallet.utils';
import { RECOMMENDED_BAKER_ADDRESS } from '../../select-baker-modal/select-baker-modal';
import { InternalOperationsConfirmationModalParams } from '../confirmation-modal.params';
import { OperationsConfirmation } from '../operations-confirmation/operations-confirmation';

type Props = Omit<InternalOperationsConfirmationModalParams, 'type'>;

const approveInternalOperationRequest = ({
  rpcUrl,
  sender,
  opParams
}: ApproveInternalOperationRequestActionPayloadInterface) =>
  sendTransaction$(rpcUrl, sender, opParams).pipe(
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
  const selectedAccount = useSelectedAccountSelector();
  const rpcUrl = useSelectedRpcUrlSelector();
  const dispatch = useDispatch();
  const { balance: tezBalance } = useSelectedAccountTezosTokenSelector();

  const { confirmRequest, isLoading } = useRequestConfirmation(approveInternalOperationRequest);

  const totalTransactionCost = useMemo(() => {
    if (opParams[0]?.kind === OpKind.TRANSACTION) {
      // @ts-ignore
      return BigNumber.sum(...opParams.map(({ amount }) => amount));
    }

    return new BigNumber(0);
  }, [opParams]);

  useEffect(() => {
    if (new BigNumber(tezBalance).isLessThanOrEqualTo(totalTransactionCost)) {
      dispatch(setOnRampPossibilityAction(true));
    }
  }, [tezBalance, totalTransactionCost]);

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

  return (
    <>
      <OperationsConfirmation
        sender={selectedAccount}
        opParams={opParams}
        isLoading={isLoading}
        onSubmit={newOpParams => confirmRequest({ rpcUrl, sender: selectedAccount, opParams: newOpParams })}
        testID={testID}
        disclaimer={disclaimer}
      />
      <OnRampOverlay />
    </>
  );
};
