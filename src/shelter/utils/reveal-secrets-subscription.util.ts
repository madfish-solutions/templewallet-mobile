import { Dispatch } from '@reduxjs/toolkit';
import { catchError, map, merge, of, Subject, switchMap, tap } from 'rxjs';

import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';

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
      tap(() => dispatch(showLoaderAction())),
      switchMap(({ publicKeyHash, successCallback }) =>
        Shelter.revealSecretKey$(publicKeyHash).pipe(
          map((secretKey): [string | undefined, SyncFn<string>] => [secretKey, successCallback])
        )
      ),
      tap(() => dispatch(hideLoaderAction()))
    ),
    revealSeedPhrase$.pipe(
      tap(() => dispatch(showLoaderAction())),
      switchMap(({ successCallback }) =>
        Shelter.revealSeedPhrase$()
          .pipe(catchError(() => of(undefined)))
          .pipe(map((seedPhrase): [string | undefined, SyncFn<string>] => [seedPhrase, successCallback]))
      ),
      tap(() => dispatch(hideLoaderAction()))
    )
  ).subscribe(([value, successCallback]) => value !== undefined && successCallback(value));
