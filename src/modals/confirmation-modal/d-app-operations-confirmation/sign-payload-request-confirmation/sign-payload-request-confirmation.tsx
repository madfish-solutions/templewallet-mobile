import { BeaconMessageType, SignPayloadRequestOutput } from '@airgap/beacon-sdk';
import React, { FC, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { map, switchMap } from 'rxjs/operators';

import { BeaconHandler } from 'src/beacon/beacon-handler';
import { AccountDropdownItem } from 'src/components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { useDappRequestConfirmation } from 'src/hooks/request-confirmation/use-dapp-request-confirmation.hook';
import { useParseSignPayload } from 'src/hooks/use-parse-sign-payload.hook';
import { emptyAccount } from 'src/interfaces/account.interface';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { navigateBackAction } from 'src/store/root-state.actions';
import { useAccountsListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showSuccessToast } from 'src/toast/toast.utils';

import { AppMetadataView } from '../app-metadata-view/app-metadata-view';
import { SignPayloadRequestConfirmationSelectors } from './sign-payload-request-confirmation.selectors';
import { useSignPayloadRequestConfirmationStyles } from './sign-payload-request-confirmation.styles';

interface Props {
  message: SignPayloadRequestOutput;
}

const approveSignPayloadRequest = (message: SignPayloadRequestOutput) =>
  Shelter.getSigner$(message.sourceAddress).pipe(
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

const PAYLOAD_PREVIEW_TYPE_INDEX = 0;

export const SignPayloadRequestConfirmation: FC<Props> = ({ message }) => {
  const styles = useSignPayloadRequestConfirmationStyles();
  const { goBack } = useNavigation();
  const accounts = useAccountsListSelector();

  const { payloadPreview, isPayloadParsed } = useParseSignPayload(message);

  const [payloadTypeIndex, setPayloadTypeIndex] = useState(0);
  const isPayloadPreviewType = payloadTypeIndex === PAYLOAD_PREVIEW_TYPE_INDEX;

  const { confirmRequest, isLoading } = useDappRequestConfirmation(message, approveSignPayloadRequest);

  const approver = useMemo(
    () => accounts.find(({ publicKeyHash }) => publicKeyHash === message.sourceAddress) ?? emptyAccount,
    [accounts, message.sourceAddress]
  );

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Confirm Sign" /> }, []);

  return (
    <>
      <ScreenContainer>
        <AppMetadataView appMetadata={message.appMetadata} />
        <Divider />
        <Label label="Account" />
        <Divider />
        <AccountDropdownItem account={approver} />
        <Divider />
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>Payload to sign</Text>
          {isPayloadParsed && (
            <TextSegmentControl
              width={formatSize(181)}
              selectedIndex={payloadTypeIndex}
              values={['Preview', 'Bytes']}
              onChange={setPayloadTypeIndex}
            />
          )}
        </View>
        <Divider size={formatSize(16)} />
        <Text style={styles.payloadText}>
          {isPayloadParsed ? (isPayloadPreviewType ? payloadPreview : message.payload) : message.payload}
        </Text>
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargeSecondary
          title="Cancel"
          disabled={isLoading}
          onPress={goBack}
          testID={SignPayloadRequestConfirmationSelectors.cancelButton}
        />
        <Divider size={formatSize(16)} />
        <ButtonLargePrimary
          title="Sign"
          disabled={isLoading}
          onPress={() => confirmRequest(message)}
          testID={SignPayloadRequestConfirmationSelectors.signButton}
        />
      </ModalButtonsContainer>
    </>
  );
};
