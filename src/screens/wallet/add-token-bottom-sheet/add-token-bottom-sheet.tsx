import React, { FC } from 'react';

import { ModalBottomSheet } from '../../../components/bottom-sheet/modal-bottom-sheet/modal-bottom-sheet';
import { BottomSheetControllerProps } from '../../../components/bottom-sheet/use-bottom-sheet-controller';
import { Label } from '../../../components/label/label';

export const AddTokenBottomSheet: FC<BottomSheetControllerProps> = ({ controller }) => {
  return (
    <ModalBottomSheet title="Add Token" controller={controller}>
      <Label label="Token type" />
      <Label label="Address" description="Address of deployed token contract." />
      <Label
        label="Token ID"
        description="A non negative integer number that identifies the token inside FA2 contract"
      />
    </ModalBottomSheet>
  );
};
