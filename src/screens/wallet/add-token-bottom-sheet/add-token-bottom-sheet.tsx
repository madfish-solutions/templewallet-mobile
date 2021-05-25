import React, { FC, useState } from 'react';

import { ModalBottomSheet } from '../../../components/bottom-sheet/modal-bottom-sheet/modal-bottom-sheet';
import { BottomSheetControllerProps } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { AddTokenAddress } from './add-token-address/add-token-address';
import { AddTokenInfo } from './add-token-info/add-token-info';

export const AddTokenBottomSheet: FC<BottomSheetControllerProps> = ({ controller }) => {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  return (
    <ModalBottomSheet title="Add Token" controller={controller}>
      {innerScreenIndex === 0 && (
        <AddTokenAddress onCloseButtonPress={controller.close} onFormSubmitted={() => setInnerScreenIndex(1)} />
      )}
      {innerScreenIndex === 1 && (
        <AddTokenInfo onCancelButtonPress={() => setInnerScreenIndex(0)} onFormSubmitted={controller.close} />
      )}
    </ModalBottomSheet>
  );
};
