import GorhomBottomSheet from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { FC } from 'react';

import { emptyComponent } from '../../config/general';
import { BottomSheetBackdrop } from './bottom-sheet-backdrop';
import { BottomSheetControllerProps } from './use-bottom-sheet-controller';

interface Props extends BottomSheetControllerProps {
  contentHeight: number;
}

export const BottomSheet: FC<Props> = ({ controller, contentHeight, children }) => {
  return (
    <Portal>
      <GorhomBottomSheet
        ref={controller.ref}
        snapPoints={[0, contentHeight]}
        handleComponent={emptyComponent}
        backdropComponent={props => <BottomSheetBackdrop {...props} onPress={controller.close} />}>
        {children}
      </GorhomBottomSheet>
    </Portal>
  );
};
