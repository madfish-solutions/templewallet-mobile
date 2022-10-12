import { Dispatch } from '@reduxjs/toolkit';
import { catchError, map, merge, of, Subject, switchMap, tap } from 'rxjs';

import { EventFn } from '../../config/general';
import { setLoadingAction } from '../../store/settings/settings-actions';
import { RevealSecretKeyParams } from '../interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from '../interfaces/reveal-seed-phrase.params';
import { Shelter } from '../shelter';

export const revealSecretsSubscription = (
  revealSecretKey$: Subject<RevealSecretKeyParams>,
  revealSeedPhrase$: Subject<RevealSeedPhraseParams>,
  dispatch: Dispatch
) =>
  merge(
    revealSecretKey$.pipe(
      tap(() => dispatch(setLoadingAction(true))),
      switchMap(({ publicKeyHash, successCallback }) =>
        Shelter.revealSecretKey$(publicKeyHash).pipe(
          map((secretKey): [string | undefined, EventFn<string>] => [secretKey, successCallback])
        )
      ),
      tap(() => dispatch(setLoadingAction(false)))
    ),
    revealSeedPhrase$.pipe(
      tap(() => dispatch(setLoadingAction(true))),
      switchMap(({ successCallback }) =>
        Shelter.revealSeedPhrase$()
          .pipe(catchError(() => of(undefined)))
          .pipe(map((seedPhrase): [string | undefined, EventFn<string>] => [seedPhrase, successCallback]))
      ),
      tap(() => dispatch(setLoadingAction(false)))
    )
  ).subscribe(([value, successCallback]) => {
    if (value !== undefined) {
      successCallback(value);
    }
  });
