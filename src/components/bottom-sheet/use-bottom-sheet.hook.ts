import { useState } from 'react';

export const useBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const onDismiss = () => setIsOpen(false);

  return { isOpen, onOpen, onClose, onDismiss };
};
