import { useEffect, useRef } from 'react';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { isDefined } from '../../utils/is-defined';

export const useBottomSheetRef = (isOpen: boolean) => {
  const ref = useRef<ReanimatedBottomSheet>(null);

  const openBottomSheet = () => void (isDefined(ref.current) && ref.current.snapTo(0));
  const closeBottomSheet = () => void (isDefined(ref.current) && ref.current.snapTo(1));

  useEffect(() => void (isOpen ? openBottomSheet() : closeBottomSheet()), [isOpen]);

  return { ref, closeBottomSheet };
};
