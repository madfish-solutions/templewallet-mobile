import { BeaconMessageType, SignPayloadRequestOutput } from '@airgap/beacon-sdk';
import React, { FC, useMemo } from 'react';
import { map, switchMap } from 'rxjs/operators';

import { BeaconHandler } from 'src/beacon/beacon-handler';
import { useDappRequestConfirmation } from 'src/hooks/request-confirmation/use-dapp-request-confirmation.hook';
import { useParseSignPayload } from 'src/hooks/use-parse-sign-payload.hook';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { navigateBackAction } from 'src/store/root-state.actions';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { showSuccessToast } from 'src/toast/toast.utils';
import { getAccountAddressForTezos } from 'src/utils/account.utils';

import { SignRequestConfirmationContent } from '../../common/sign-request-confirmation-content';

import { SignPayloadRequestConfirmationSelectors } from './sign-payload-request-confirmation.selectors';

interface Props {
  message: SignPayloadRequestOutput;
}

const approveSignPayloadRequest = (message: SignPayloadRequestOutput) =>
  Shelter.getTezosSigner$(message.sourceAddress).pipe(
    switchMap(signer => signer.sign(message.payload)),
    switchMap(({ prefixSig }) =>
      BeaconHandler.respond({
        type: BeaconMessageType.SignPayloadResponse,
        id: message.id,
        signingType: message.signingType,
        signature: prefixSig
      })
    ),
    map(() => {
      showSuccessToast({ description: 'Successfully signed!' });

      return navigateBackAction();
    })
  );

export const SignPayloadRequestConfirmation: FC<Props> = ({ message }) => {
  const { goBack } = useNavigation();
  const accounts = useAllAccounts();

  const { payloadPreview, isPayloadParsed } = useParseSignPayload(message);
  const { confirmRequest, isLoading } = useDappRequestConfirmation(message, approveSignPayloadRequest);

  const approver = useMemo(
    () => accounts.find(account => getAccountAddressForTezos(account) === message.sourceAddress)!,
    [accounts, message.sourceAddress]
  );

  return (
    <SignRequestConfirmationContent
      headerTitle="Confirm Sign"
      appName={message.appMetadata.name}
      iconUri={message.appMetadata.icon}
      iconSeed={message.appMetadata.senderId}
      account={approver}
      payload={isPayloadParsed ? payloadPreview : message.payload}
      bytesPayload={isPayloadParsed ? message.payload : undefined}
      isLoading={isLoading}
      cancelTestID={SignPayloadRequestConfirmationSelectors.cancelButton}
      confirmTestID={SignPayloadRequestConfirmationSelectors.signButton}
      onCancel={goBack}
      onConfirm={() => confirmRequest(message)}
    />
  );
};
