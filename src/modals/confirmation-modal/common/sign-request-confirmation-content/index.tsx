import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';

import { AccountDropdownItem } from 'src/components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { Account } from 'src/interfaces/account.interfaces';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { AppMetadataView } from '../app-metadata-view';

import { useSignRequestConfirmationContentStyles } from './styles';

const PAYLOAD_PREVIEW_TYPE_INDEX = 0;

interface Props {
  headerTitle?: string;
  appName: string;
  iconUri?: string;
  iconSeed: string;
  appDescription?: string;
  account: Account;
  /** Human-readable payload preview. */
  payloadPreview?: string;
  /** Raw bytes payload. When both `payload` and `bytesPayload` are defined, shows Preview / Bytes switcher. */
  bytesPayload?: string;
  isLoading: boolean;
  cancelTestID: string;
  confirmTestID: string;
  onCancel: EmptyFn;
  onConfirm: EmptyFn;
}

export const SignRequestConfirmationContent: FC<Props> = ({
  headerTitle = 'Confirm Sign',
  appName,
  iconUri,
  iconSeed,
  appDescription,
  account,
  payloadPreview,
  bytesPayload,
  isLoading,
  cancelTestID,
  confirmTestID,
  onCancel,
  onConfirm
}) => {
  const styles = useSignRequestConfirmationContentStyles();
  const [payloadTypeIndex, setPayloadTypeIndex] = useState(PAYLOAD_PREVIEW_TYPE_INDEX);
  const hasSwitcher = isDefined(bytesPayload) && isDefined(payloadPreview);

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title={headerTitle} /> }, [headerTitle]);

  let payloadText: string;
  if (hasSwitcher) {
    payloadText = payloadTypeIndex === PAYLOAD_PREVIEW_TYPE_INDEX ? payloadPreview : bytesPayload;
  } else {
    payloadText = payloadPreview ?? bytesPayload ?? '';
  }

  return (
    <>
      <ScreenContainer>
        <AppMetadataView name={appName} iconUri={iconUri} iconSeed={iconSeed} description={appDescription} />
        <Divider />
        <Label label="Account" />
        <Divider />
        <AccountDropdownItem account={account} />
        <Divider />
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>Payload to sign</Text>
          {hasSwitcher && (
            <TextSegmentControl
              width={formatSize(181)}
              selectedIndex={payloadTypeIndex}
              values={['Preview', 'Bytes']}
              onChange={setPayloadTypeIndex}
            />
          )}
        </View>
        <Divider size={formatSize(16)} />
        <Text style={styles.payloadText}>{payloadText}</Text>
      </ScreenContainer>
      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary title="Cancel" disabled={isLoading} onPress={onCancel} testID={cancelTestID} />
        <ButtonLargePrimary title="Sign" disabled={isLoading} onPress={onConfirm} testID={confirmTestID} />
      </ModalButtonsFloatingContainer>
    </>
  );
};
