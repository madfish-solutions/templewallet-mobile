import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { FC, useEffect, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { EmptyFn } from '../../config/general';
import { step } from '../../config/styles';
import { isDefined } from '../../utils/is-defined';
import { BottomSheetStyles } from './bottom-sheet.styles';

export interface BottomSheetProps {
  isOpen: boolean;
  onDismiss: EmptyFn;
}

export const BottomSheet: FC<BottomSheetProps> = ({ isOpen, onDismiss, children }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const height = useWindowDimensions().height - 10 * step;

  useEffect(
    () =>
      void (
        isDefined(bottomSheetModalRef.current) &&
        (isOpen ? bottomSheetModalRef.current.present() : bottomSheetModalRef.current.dismiss())
      ),
    [isOpen]
  );

  return (
    <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={[0, height]} onDismiss={onDismiss}>
      <View style={BottomSheetStyles.contentContainer}>{children}</View>
    </BottomSheetModal>
  );
};
