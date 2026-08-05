import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { addContactCandidateAddressAction } from 'src/store/contact-book/contact-book-actions';
import { prepareSaplingTransactionActions } from 'src/store/sapling/sapling-actions';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { sendAssetActions } from 'src/store/wallet/wallet-actions';
import { showErrorToast } from 'src/toast/toast.utils';
import { isTezosDomainNameValid, tezosDomainsResolver } from 'src/utils/dns.utils';
import { isDefined } from 'src/utils/is-defined';

import { createSendIntent, SendIntent, SendIntentFailureReason } from '../create-send-intent';
import { SendModalFormValues } from '../form';

interface UseSendSubmissionParams {
  accountId?: string;
  evmAddress?: string;
  tezosAddress?: string;
  tezosBalance: string;
}

interface UseSendSubmissionResult {
  isLoading: boolean;
  submit: (values: SendModalFormValues) => Promise<void>;
}

const sourceAccountErrorMessages: Record<SendIntentFailureReason, string> = {
  'missing-evm-account': 'Select an Etherlink account to send assets',
  'missing-tezos-account': 'Select a Tezos account to send assets'
};

export const useSendSubmission = ({
  accountId,
  evmAddress,
  tezosAddress,
  tezosBalance
}: UseSendSubmissionParams): UseSendSubmissionResult => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigateToModal = useNavigateToModal();
  const resolver = useMemo(() => tezosDomainsResolver(), []);

  const executeIntent = useCallback(
    (intent: SendIntent) => {
      switch (intent.type) {
        case 'evm-transfer':
          navigateToModal(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.EvmInternalOperations,
            accountId: intent.accountId,
            asset: intent.asset,
            receiverAddress: intent.receiverAddress,
            atomicAmount: intent.atomicAmount
          });
          break;

        case 'sapling-transaction':
          dispatch(
            prepareSaplingTransactionActions.submit({
              type: intent.transactionType,
              amount: intent.amount,
              recipientAddress: intent.recipientAddress,
              ...(intent.transactionType !== 'unshield' && { memo: intent.memo })
            })
          );
          break;

        case 'tezos-transfer':
          dispatch(
            sendAssetActions.submit({
              asset: intent.asset,
              receiverPublicKeyHash: intent.receiverAddress,
              amount: intent.amount
            })
          );
          break;

        case 'on-ramp':
          dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));
          break;
      }
    },
    [dispatch, navigateToModal]
  );

  const submit = useCallback(
    async ({ assetAmount: { asset, amount }, recipient, transferBetweenOwnAccounts, memo }: SendModalFormValues) => {
      if (!isDefined(amount)) {
        return;
      }

      let receiverAddress = recipient;

      if (
        asset.chainKind === TempleChainKind.Tezos &&
        !transferBetweenOwnAccounts &&
        isTezosDomainNameValid(recipient)
      ) {
        setIsLoading(true);
        const resolvedAddress = await resolver.resolveNameToAddress(recipient).catch(() => null);
        setIsLoading(false);

        if (!resolvedAddress) {
          showErrorToast({ title: 'Error!', description: 'Unable to resolve this Tezos domain' });

          return;
        }

        receiverAddress = resolvedAddress;
      }

      if (!transferBetweenOwnAccounts) {
        dispatch(addContactCandidateAddressAction(receiverAddress));
      }

      const result = createSendIntent({
        accountId,
        amount,
        asset,
        evmAddress,
        isOnRampEnabled: !LIMIT_FIN_FEATURES,
        memo,
        receiverAddress,
        tezosAddress,
        tezosBalance
      });

      if (!result.success) {
        showErrorToast({ description: sourceAccountErrorMessages[result.reason] });

        return;
      }

      executeIntent(result.intent);
    },
    [accountId, dispatch, evmAddress, executeIntent, resolver, tezosAddress, tezosBalance]
  );

  return { isLoading, submit };
};
