import React from 'react';

import { emptyFn } from '../../config/general';
import { step } from '../../config/styles';
import { ReceiveBottomSheet } from '../../screens/wallet/receive-bottom-sheet/receive-bottom-sheet';
import { SendBottomSheet } from '../../screens/wallet/send-bottom-sheet/send-bottom-sheet';
import { useBottomSheetController } from '../bottom-sheet/use-bottom-sheet-controller';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonsContainer } from '../buttons-container/buttons-container';
import { IconNameEnum } from '../icon/icon-name.enum';

export const HeaderCardActionButtons = () => {
  const receiveBottomSheetController = useBottomSheetController();
  const sendBottomSheetController = useBottomSheetController();

  return (
    <>
      <ButtonsContainer>
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
      </ButtonsContainer>

      <ReceiveBottomSheet controller={receiveBottomSheetController} />
      <SendBottomSheet controller={sendBottomSheetController} />
    </>
  );
};
