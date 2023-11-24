import { StackNavigationOptions, TransitionPresets } from '@react-navigation/stack';
import { useMemo } from 'react';

import { useColors } from 'src/styles/use-colors';

/**
 * Look into:
 * - https://reactnavigation.org/docs/stack-navigator/#detachinactivescreens
 * - https://reactnavigation.org/docs/stack-navigator/#detachpreviousscreen
 *
 * Beware of this: In some cases this cannot be disabled.
 * I.e. `in-app-browser` modal relies on `confirmation` modal (when opened)
 * to return back to opened `in-app-browser` after action is taken.
 */
export const useStackNavigationOptions = () => {
  const colors = useColors();

  return useMemo<StackNavigationOptions>(
    () => ({
      presentation: 'modal',
      cardOverlayEnabled: true,
      gestureEnabled: true,
      ...TransitionPresets.ModalPresentationIOS,
      cardStyle: {
        backgroundColor: colors.pageBG
      }
    }),
    [colors.pageBG]
  );
};
