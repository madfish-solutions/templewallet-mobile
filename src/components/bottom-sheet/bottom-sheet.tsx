import ReanimatedBottomSheet from 'reanimated-bottom-sheet';
import React, { FC, ReactNode, useEffect, useRef } from 'react';

import { EmptyFn } from '../../config/general';
import { isDefined } from '../../utils/is-defined';

export interface BottomSheetProps {
  isOpen: boolean;
  onDismiss: EmptyFn;
}

interface Props extends BottomSheetProps {
  height: number;
  renderContent: () => ReactNode;
}

export const BottomSheet: FC<Props> = ({ isOpen, onDismiss, height, renderContent }) => {
  const bottomSheetModalRef = useRef<ReanimatedBottomSheet>(null);

  useEffect(
    () =>
      void (
        isDefined(bottomSheetModalRef.current) &&
        (isOpen ? bottomSheetModalRef.current.snapTo(0) : bottomSheetModalRef.current.snapTo(1))
      ),
    [isOpen]
  );

  return (
    <ReanimatedBottomSheet
      ref={bottomSheetModalRef}
      snapPoints={[height, 0]}
      initialSnap={1}
      onCloseEnd={onDismiss}
      renderContent={renderContent}
    />
  );
};
