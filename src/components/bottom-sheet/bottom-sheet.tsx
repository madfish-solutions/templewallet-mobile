import React, { FC, ReactNode, useEffect, useRef } from 'react';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { EmptyFn } from '../../config/general';
import { isDefined } from '../../utils/is-defined';

interface Props {
  height: number;
  renderContent: () => ReactNode;
  onCloseEnd: EmptyFn;
}

export const BottomSheet: FC<Props> = ({ height, renderContent, onCloseEnd }) => {
  const bottomSheetModalRef = useRef<ReanimatedBottomSheet>(null);

  useEffect(() => void (isDefined(bottomSheetModalRef.current) && bottomSheetModalRef.current.snapTo(0)), []);

  return (
    <ReanimatedBottomSheet
      ref={bottomSheetModalRef}
      snapPoints={[height, 0]}
      initialSnap={1}
      onCloseEnd={onCloseEnd}
      renderContent={renderContent}
    />
  );
};
