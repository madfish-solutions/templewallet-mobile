import { OpKind } from '@taquito/taquito';
import React, { FC } from 'react';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { everstakeApi } from '../../../api.service';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { ActivityStatusEnum } from '../../../enums/activity-status.enum';
import { ActivityTypeEnum } from '../../../enums/activity-type.enum';
import { ApproveInternalOperationRequestActionPayloadInterface } from '../../../hooks/request-confirmation/approve-internal-operation-request-action-payload.interface';
import { useRequestConfirmation } from '../../../hooks/request-confirmation/use-request-confirmation.hook';
import { ActivityInterface } from '../../../interfaces/activity.interface';
import { StacksEnum } from '../../../navigator/enums/stacks.enum';
import { addPendingActivity } from '../../../store/activity/activity-actions';
import { navigateAction } from '../../../store/root-state.actions';
import { useSelectedRpcUrlSelector } from '../../../store/settings/settings-selectors';
import { waitForOperationCompletionAction } from '../../../store/wallet/wallet-actions';
import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
import { showSuccessToast } from '../../../toast/toast.utils';
import {
  LIQUIDITY_BAKING_LP_SLUG,
  LIQUIDITY_BAKING_LP_TOKEN_ADDRESS,
  LIQUIDITY_BAKING_LP_TOKEN_ID
} from '../../../token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from '../../../token/data/tokens-metadata';
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
    switchMap(batch =>
      opParams[0]?.kind === OpKind.DELEGATION && opParams[0]?.delegate === RECOMMENDED_BAKER_ADDRESS
        ? of(
            everstakeApi.post('/delegations', {
              link_id: TEMPLE_WALLET_EVERSTAKE_LINK_ID,
              delegations: [batch.hash]
            })
          ).pipe(map(() => batch))
        : of(batch)
    ),
    switchMap(activity => {
      showSuccessToast({
        operationHash: activity.hash,
        description: 'Transaction request sent! Confirming...',
        title: 'Success!'
      });

      const pendingActivity: Array<ActivityInterface> = activity.results.map(operation => {
        let slug = '';
        let address = '';
        let tokenId;
        let amount = '0';
        if (operation.kind === OpKind.TRANSACTION) {
          if (operation.amount !== '0') {
            address = TEZ_TOKEN_SLUG;
            amount = operation.amount;
          }
          if (operation.parameters?.entrypoint === 'update_operators') {
            const params = operation.parameters;
            const value = params.value as unknown;
            const outerArg =
              isDefined(value) && Array.isArray(value) && value.length > 0 && isDefined(value[0].args)
                ? value[0].args
                : null;
            const innerArg =
              isDefined(outerArg) && Array.isArray(outerArg) && outerArg.length > 0 && isDefined(outerArg[0].args)
                ? outerArg[0].args
                : null;
            const lastArg =
              isDefined(innerArg) && Array.isArray(innerArg) && innerArg.length > 1 && isDefined(innerArg[1].args)
                ? innerArg[1].args
                : null;

            if (
              Array.isArray(lastArg) &&
              lastArg.length > 1 &&
              isDefined(lastArg[1].int) &&
              isDefined(lastArg[0].string)
            ) {
              slug = lastArg[0].string + '_' + lastArg[1].int;
              address = lastArg[0].string;
              tokenId = lastArg[1].int;
              amount = operation.amount;
            }
          }
          if (operation.parameters?.entrypoint === 'approve') {
            slug = `${operation.destination}_0`;
            address = operation.destination;
            tokenId = 0;
            amount = operation.amount;
          }
          if (
            operation.parameters?.entrypoint === 'removeLiquidity' ||
            operation.parameters?.entrypoint === 'addLiquidity'
          ) {
            slug = LIQUIDITY_BAKING_LP_SLUG;
            address = LIQUIDITY_BAKING_LP_TOKEN_ADDRESS;
            tokenId = LIQUIDITY_BAKING_LP_TOKEN_ID;
            amount = operation.amount;
          }
        }

        return {
          hash: activity.hash,
          type: ActivityTypeEnum.Transaction,
          status: ActivityStatusEnum.Pending,
          amount,
          address,
          tokenId,
          timestamp: Date.now(),
          destination: {
            address: slug
          },
          source: {
            address: sender.publicKeyHash
          },
          id: -1
        };
      });

      return [
        navigateAction(StacksEnum.MainStack),
        addPendingActivity(pendingActivity),
        waitForOperationCompletionAction({ opHash: activity.hash, sender })
      ];
    })
  );

export const InternalOperationsConfirmation: FC<Props> = ({ opParams }) => {
  const selectedAccount = useSelectedAccountSelector();
  const rpcUrl = useSelectedRpcUrlSelector();

  const { confirmRequest, isLoading } = useRequestConfirmation(approveInternalOperationRequest);

  useNavigationSetOptions(
    {
      headerTitle: () => {
        switch (opParams[0]?.kind) {
          case OpKind.DELEGATION:
            return <HeaderTitle title="Confirm Delegate" />;
          case OpKind.TRANSACTION:
            return <HeaderTitle title="Confirm Send" />;
          default:
            return <HeaderTitle title="Confirm Operation" />;
        }
      }
    },
    []
  );

  return (
    <OperationsConfirmation
      sender={selectedAccount}
      opParams={opParams}
      isLoading={isLoading}
      onSubmit={newOpParams => confirmRequest({ rpcUrl, sender: selectedAccount, opParams: newOpParams })}
    />
  );
};
