import { BeaconMessageType } from '@airgap/beacon-sdk';
import { SignPayloadRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';
import { map, switchMap } from 'rxjs/operators';

import { BeaconHandler } from '../../../../beacon/beacon-handler';
import { AccountDropdownItem } from '../../../../components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../../../components/divider/divider';
import { HeaderTitle } from '../../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../../components/header/use-navigation-set-options.hook';
import { Label } from '../../../../components/label/label';
import { ModalButtonsContainer } from '../../../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { useDappRequestConfirmation } from '../../../../hooks/request-confirmation/use-dapp-request-confirmation.hook';
import { emptyWalletAccount } from '../../../../interfaces/wallet-account.interface';
import { StacksEnum } from '../../../../navigator/enums/stacks.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { Shelter } from '../../../../shelter/shelter';
import { navigateAction } from '../../../../store/root-state.actions';
import { useAccountsListSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { showSuccessToast } from '../../../../toast/toast.utils';
import { AppMetadataView } from '../app-metadata-view/app-metadata-view';
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

      return navigateAction(StacksEnum.MainStack);
    })
  );

export const SignPayloadRequestConfirmation: FC<Props> = ({ message }) => {
  const styles = useSignPayloadRequestConfirmationStyles();
  const { goBack } = useNavigation();
  const accounts = useAccountsListSelector();

  const { confirmRequest, isLoading } = useDappRequestConfirmation(message, approveSignPayloadRequest);

  const approver = useMemo(
    () => accounts.find(({ publicKeyHash }) => publicKeyHash === message.sourceAddress) ?? emptyWalletAccount,
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
          <Divider size={formatSize(12)} />
          <Text style={styles.descriptionText}>Payload to sign</Text>
          <Divider size={formatSize(12)} />
        </View>
        <Divider size={formatSize(16)} />
        <Text style={styles.payloadText}>{message.payload}</Text>
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargeSecondary title="Cancel" disabled={isLoading} onPress={goBack} />
        <Divider size={formatSize(16)} />
        <ButtonLargePrimary title="Sign" disabled={isLoading} onPress={() => confirmRequest(message)} />
      </ModalButtonsContainer>
    </>
  );
};
