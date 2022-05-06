import BottomSheet from '@gorhom/bottom-sheet';
import { RefObject, useMemo, useRef } from 'react';

import { EmptyFn } from '../../config/general';
import { isDefined } from '../../utils/is-defined';

export interface BottomSheetController {
  ref: RefObject<BottomSheet>;
  open: EmptyFn;
  close: EmptyFn;
}

export interface BottomSheetControllerProps {
  controller: BottomSheetController;
}

export const useBottomSheetController = (): BottomSheetController => {
  const ref = useRef<BottomSheet>(null);

  const open = () => {
    isDefined(ref.current) && ref.current.expand();
    console.log('opened');
  };
  const close = () => {
    isDefined(ref.current) && ref.current.close();
    console.log('closed');
  };

  return useMemo(() => ({ ref, open, close }), []);
};
