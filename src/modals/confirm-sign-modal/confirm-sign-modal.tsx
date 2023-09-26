import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';

import { ConfirmSignSelectors } from 'src/modals/confirm-sign-modal/selectors';
import { useSignMessage } from 'src/modals/confirm-sign-modal/use-sign-message.hook';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';

import { AccountDropdownItem } from '../../components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../components/divider/divider';
import { Label } from '../../components/label/label';
import { ModalButtonsContainer } from '../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { useConfirmSignModalStyles } from './confirm-sign-modal.styles';

const PAYLOAD_PREVIEW_TYPE_INDEX = 0;

export const ConfirmSignModal: FC = () => {
  const params = useRoute<RouteProp<ModalsParamList, ModalsEnum.ConfirmSign>>().params;
  const styles = useConfirmSignModalStyles();

  const { goBack } = useNavigation();

  const account = useSelectedAccountSelector();

  const [payloadTypeIndex, setPayloadTypeIndex] = useState(0);
  const isPayloadPreviewType = payloadTypeIndex === PAYLOAD_PREVIEW_TYPE_INDEX;

  const { signMessage, isLoading, messagePreview, messageBytes } = useSignMessage(params);

  return (
    <>
      <ScreenContainer contentContainerStyle={styles.root}>
        <Label label="Account" style={[styles.label, styles.grid]} />

        <View style={styles.line} />

        <View style={styles.grid}>
          <AccountDropdownItem account={account} />
        </View>

        <Divider size={formatSize(32)} />

        <View style={[styles.segmentControl, styles.grid]}>
          <Text style={styles.segmentTitle}>Payload to sign</Text>
          <TextSegmentControl
            width={formatSize(140)}
            selectedIndex={payloadTypeIndex}
            values={['Preview', 'Bytes']}
            onChange={setPayloadTypeIndex}
          />
        </View>

        <Divider size={formatSize(16)} />

        <Text style={[styles.payload, styles.grid]}>{isPayloadPreviewType ? messagePreview : messageBytes}</Text>
      </ScreenContainer>

      <ModalButtonsContainer>
        <ButtonLargeSecondary
          title="Cancel"
          disabled={isLoading}
          onPress={goBack}
          testID={ConfirmSignSelectors.cancelButton}
        />

        <Divider size={formatSize(16)} />

        <ButtonLargePrimary
          title="Sign"
          disabled={isLoading}
          isLoading={isLoading}
          onPress={signMessage}
          testID={ConfirmSignSelectors.signButton}
        />
      </ModalButtonsContainer>
    </>
  );
};
