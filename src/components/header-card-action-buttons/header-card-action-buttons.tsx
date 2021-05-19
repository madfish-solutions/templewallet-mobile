import React from 'react';
import { View } from 'react-native';

import { emptyFn } from '../../config/general';
import { step } from '../../config/styles';
import { ReceiveBottomSheet } from '../../screens/wallet/receive-bottom-sheet/receive-bottom-sheet';
import { SendBottomSheet } from '../../screens/wallet/send-bottom-sheet/send-bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { IconNameEnum } from '../icon/icon-name.enum';
import { HeaderCardActionButtonsStyles } from './header-card-action-buttons.styles';

export const HeaderCardActionButtons = () => {
  const receiveBottomSheetController = useBottomSheetController();
  const sendBottomSheetController = useBottomSheetController();

  return (
    <>
      <View style={HeaderCardActionButtonsStyles.container}>
        <ButtonMedium
          title="RECEIVE"
          iconName={IconNameEnum.ArrowDown}
          marginRight={step}
          onPress={receiveBottomSheetController.open}
        />
        <ButtonMedium
          title="SEND"
          iconName={IconNameEnum.ArrowUp}
          marginRight={step}
          onPress={sendBottomSheetController.open}
        />
        <ButtonMedium title="BUY" iconName={IconNameEnum.ShoppingCard} disabled={true} onPress={emptyFn} />
      </View>

      <ReceiveBottomSheet controller={receiveBottomSheetController} />
      <SendBottomSheet controller={sendBottomSheetController} />
    </>
  );
};
