import { createContext } from 'react';

import { emptyFn } from 'src/config/general';

export interface WelcomeScreenReadyHandlers {
  onLayout: EmptyFn;
  onTransitionEnd: EmptyFn;
}

export const WelcomeScreenReadyContext = createContext<WelcomeScreenReadyHandlers>({
  onLayout: emptyFn,
  onTransitionEnd: emptyFn
});
