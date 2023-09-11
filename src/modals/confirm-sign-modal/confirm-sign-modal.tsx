import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { Text, View } from 'react-native';

import { AccountDropdownItem } from '../../components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../../components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../../components/divider/divider';
import { Label } from '../../components/label/label';
import { ModalButtonsContainer } from '../../components/modal-buttons-container/modal-buttons-container';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { useConfirmSignModalStyles } from './confirm-sign-modal.styles';
import { useSignMessage } from './use-sign-message.hook';

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
      <ScreenContainer>
        <Divider size={formatSize(8)} />

        <Label label="Account" />

        <Divider size={formatSize(8)} />

        <AccountDropdownItem account={account} />

        <Divider />

        <View style={styles.segmentControl}>
          <Text style={styles.segmentTitle}>Payload to sign</Text>
          <TextSegmentControl
            width={formatSize(181)}
            selectedIndex={payloadTypeIndex}
            values={['Preview', 'Bytes']}
            onChange={setPayloadTypeIndex}
          />
        </View>

        <Divider size={formatSize(16)} />

        <Text style={styles.payload}>{isPayloadPreviewType ? messagePreview : messageBytes}</Text>
      </ScreenContainer>

      <ModalButtonsContainer>
        <ButtonLargeSecondary title="Cancel" disabled={isLoading} onPress={goBack} />

        <Divider size={formatSize(16)} />

        <ButtonLargePrimary title="Sign" disabled={isLoading} onPress={signMessage} />
      </ModalButtonsContainer>
    </>
  );
};
