import { useState } from 'react';

export const useBottomSheetState = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onCloseEnd = () => setIsOpen(false);

  return { isOpen, onOpen, onCloseEnd };
};
