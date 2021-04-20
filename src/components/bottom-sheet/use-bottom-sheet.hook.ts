import { useState } from 'react';

export const useBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const onDismiss = () => setIsOpen(false);

  return { isOpen, open, close, onDismiss };
};
