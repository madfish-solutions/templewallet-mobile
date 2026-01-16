import React, { createContext, useContext, useEffect, useState } from 'react';
import { hide } from 'react-native-bootsplash';

import { HIDE_SPLASH_SCREEN_TIMEOUT } from '../config/animation';

const context = createContext(true);

const Provider = context.Provider;

export const HideBootsplashProvider: FCWithChildren = ({ children }) => {
  const [atBootsplash, setAtBootsplash] = useState(true);

  useEffect(() => {
    (async () => {
      await hide({ fade: true });
      setTimeout(() => void setAtBootsplash(false), HIDE_SPLASH_SCREEN_TIMEOUT);
    })();
  }, []);

  return <Provider value={atBootsplash}>{children}</Provider>;
};

export const useAtBootsplash = () => useContext(context);
