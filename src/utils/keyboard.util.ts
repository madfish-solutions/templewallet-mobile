import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export function useKeyboardShown() {
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardShown(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardShown(false));

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return keyboardShown;
}
