import { RefObject, useRef } from 'react';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { EmptyFn } from '../../config/general';
import { isDefined } from '../../utils/is-defined';

export interface BottomSheetController {
  ref: RefObject<ReanimatedBottomSheet>;
  open: EmptyFn;
  close: EmptyFn;
}

export interface BottomSheetControllerProps {
  controller: BottomSheetController;
}

export const useBottomSheetController = (): BottomSheetController => {
  const ref = useRef<ReanimatedBottomSheet>(null);

  const open = () => void (isDefined(ref.current) && ref.current.snapTo(0));
  const close = () => void (isDefined(ref.current) && ref.current.snapTo(1));

  return { ref, open, close };
};
