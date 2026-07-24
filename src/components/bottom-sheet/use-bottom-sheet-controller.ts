import BottomSheet from '@gorhom/bottom-sheet';
import { Ref, useMemo, useRef } from 'react';
import { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

import { isDefined } from 'src/utils/is-defined';

type BottomSheetCallback = (config?: WithSpringConfig | WithTimingConfig) => void;

export interface BottomSheetController {
  ref: Ref<BottomSheet>;
  open: BottomSheetCallback;
  close: BottomSheetCallback;
}

export interface BottomSheetControllerProps {
  controller: BottomSheetController;
}

export const useBottomSheetController = (): BottomSheetController => {
  const ref = useRef<BottomSheet>(null);

  const open: BottomSheetCallback = config => void (isDefined(ref.current) && ref.current.expand(config));
  const close: BottomSheetCallback = config => void (isDefined(ref.current) && ref.current.close(config));

  return useMemo<BottomSheetController>(() => ({ ref, open, close }), []);
};
