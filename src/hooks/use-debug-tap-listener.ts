import { useEffect, useRef } from 'react';
import { Subject } from 'rxjs';
import { buffer, debounceTime, filter, map } from 'rxjs/operators';

import { ScreensEnum } from '../navigator/enums/screens.enum';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';

const TAPS_COUNT = 10;
const DEBOUNCE_TIME = 500;

export function useDebugTapListener() {
  const { navigate } = useNavigation();
  const tap$ = useRef(new Subject()).current;

  useEffect(() => {
    const tapWithDebounce$ = tap$.pipe(debounceTime(DEBOUNCE_TIME));

    const navigateToDebugScreen$ = tap$
      .pipe(
        buffer(tapWithDebounce$),
        map(list => list.length),
        filter(counter => counter >= TAPS_COUNT)
      )
      .subscribe(() => navigate(ScreensEnum.Debug));

    return () => navigateToDebugScreen$.unsubscribe();
  }, []);

  const onTap = () => tap$.next();

  return { onTap };
}
