import { useCallback, useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

import { isIOS } from '../config/system';

export const useKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleKeyboardShow = useCallback((e: KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height);
    setIsKeyboardOpen(true);
  }, []);
  const handleKeyboardHide = useCallback(() => {
    setKeyboardHeight(0);
    setIsKeyboardOpen(false);
  }, []);

  useEffect(() => {
    if (isIOS) {
      Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
      Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    }

    return () => {
      if (isIOS) {
        Keyboard.removeListener('keyboardWillShow', handleKeyboardShow);
        Keyboard.removeListener('keyboardWillHide', handleKeyboardHide);
      } else {
        Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
        Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
      }
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
};
