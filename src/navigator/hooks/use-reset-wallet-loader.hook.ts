import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { hideLoaderAction } from 'src/store/settings/settings-actions';

import { WelcomeScreenReadyHandlers } from '../welcome-screen-ready.context';

export const useResetWalletLoader = (isAuthorised: boolean, isShowLoader: boolean): WelcomeScreenReadyHandlers => {
  const dispatch = useDispatch();
  const wasAuthorised = useRef(isAuthorised);
  const [welcomeHasLayout, setWelcomeHasLayout] = useState(false);
  const [welcomeTransitionEnded, setWelcomeTransitionEnded] = useState(false);

  useEffect(() => {
    if (isAuthorised) {
      wasAuthorised.current = true;
      setWelcomeHasLayout(false);
      setWelcomeTransitionEnded(false);

      return;
    }

    if (!isShowLoader) {
      wasAuthorised.current = false;

      return;
    }

    if (!wasAuthorised.current || !welcomeHasLayout || !welcomeTransitionEnded) {
      return;
    }

    // The first frame allows the Welcome layout to reach the display before the loader closes.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        wasAuthorised.current = false;
        dispatch(hideLoaderAction());
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [dispatch, isAuthorised, isShowLoader, welcomeHasLayout, welcomeTransitionEnded]);

  const onLayout = useCallback(() => setWelcomeHasLayout(true), []);
  const onTransitionEnd = useCallback(() => setWelcomeTransitionEnded(true), []);

  return useMemo(() => ({ onLayout, onTransitionEnd }), [onLayout, onTransitionEnd]);
};
