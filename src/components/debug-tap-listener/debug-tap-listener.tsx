import React, { FC, useEffect, useRef } from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { EMPTY, Subject } from 'rxjs';
import { buffer, debounceTime, filter, map } from 'rxjs/operators';

import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { DebugTapListenerStyles } from './debug-tap-listener.styles';

const NUMBER_OF_TAPS_TO_NAVIGATE = 10;
const DEBOUNCE_TIME = 500;

export const DebugTapListener: FC = ({ children }) => {
  const { navigate } = useNavigation();
  const tap$ = useRef(new Subject()).current;

  useEffect(() => {
    const tapWithDebounce$ = tap$.pipe(debounceTime(DEBOUNCE_TIME));

    const navigateToDebugScreen$ = tap$
      .pipe(
        buffer(tapWithDebounce$),
        map(list => list.length),
        filter(counter => counter >= NUMBER_OF_TAPS_TO_NAVIGATE)
      )
      .subscribe(() => navigate(ScreensEnum.Debug));

    return () => navigateToDebugScreen$.unsubscribe();
  }, []);

  const handleTouchStart = () => tap$.next(EMPTY);

  return (
    <View style={DebugTapListenerStyles.container} onTouchStart={handleTouchStart}>
      {children}
    </View>
  );
};
