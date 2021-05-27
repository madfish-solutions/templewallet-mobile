import React, { FC, useState } from 'react';

import { ModalBottomSheet } from '../../../components/bottom-sheet/modal-bottom-sheet/modal-bottom-sheet';
import { BottomSheetControllerProps } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { SelectBaker } from './select-baker/select-baker';

export const SelectBakerBottomSheet: FC<BottomSheetControllerProps> = ({ controller }) => {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  return (
    <ModalBottomSheet title="Select Baker" controller={controller}>
      {innerScreenIndex === 0 && <SelectBaker onFormSubmitted={() => setInnerScreenIndex(1)} />}
      {/*{innerScreenIndex === 1 && (*/}
      {/*  <AddTokenInfo onCancelButtonPress={() => setInnerScreenIndex(0)} onFormSubmitted={controller.close} />*/}
      {/*)}*/}
    </ModalBottomSheet>
  );
};
