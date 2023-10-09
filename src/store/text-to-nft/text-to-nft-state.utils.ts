import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { RootState } from '../types';

export const withAccessToken =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { textToNft }): [T, string | null] => [value, textToNft.accessToken])
    );
