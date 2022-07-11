import { catchError, map, merge, of, Subject, switchMap } from 'rxjs';

import { EventFn } from '../../config/general';
import { RevealSecretKeyParams } from '../interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from '../interfaces/reveal-seed-phrase.params';
import { Shelter } from '../shelter';

export const revealSecretsSubscription = (
  revealSecretKey$: Subject<RevealSecretKeyParams>,
  revealSeedPhrase$: Subject<RevealSeedPhraseParams>
) =>
  merge(
    revealSecretKey$.pipe(
      switchMap(({ publicKeyHash, successCallback }) =>
        Shelter.revealSecretKey$(publicKeyHash).pipe(
          map((secretKey): [string | undefined, EventFn<string>] => [secretKey, successCallback])
        )
      )
    ),
    revealSeedPhrase$.pipe(
      switchMap(({ successCallback }) =>
        Shelter.revealSeedPhrase$()
          .pipe(catchError(() => of(undefined)))
          .pipe(map((seedPhrase): [string | undefined, EventFn<string>] => [seedPhrase, successCallback]))
      )
    )
  ).subscribe(([value, successCallback]) => value !== undefined && successCallback(value));
