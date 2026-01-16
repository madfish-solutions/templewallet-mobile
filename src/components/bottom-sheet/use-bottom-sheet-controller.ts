import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { RefObject, useMemo, useRef } from 'react';

import { isDefined } from 'src/utils/is-defined';

interface BottomSheetController {
  ref: RefObject<BottomSheetModal>;
  open: EmptyFn;
  close: EmptyFn;
}

export interface BottomSheetControllerProps {
  controller: BottomSheetController;
}

export const useBottomSheetController = (): BottomSheetController => {
  const ref = useRef<BottomSheetModal>(null);

  const open = () => void (isDefined(ref.current) && ref.current.expand());
  const close = () => void (isDefined(ref.current) && ref.current.close());

  return useMemo(() => ({ ref: ref as RefObject<BottomSheetModal>, open, close }), []);
};
