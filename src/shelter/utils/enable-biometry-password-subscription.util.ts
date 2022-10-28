import { Dispatch } from '@reduxjs/toolkit';
import { of, Subject, switchMap, tap } from 'rxjs';

import { StacksEnum } from '../../navigator/enums/stacks.enum';
import { hideLoaderAction, setIsBiometricsEnabled, showLoaderAction } from '../../store/settings/settings-actions';
import { showErrorToast, showSuccessToast } from '../../toast/toast.utils';
import { Shelter } from '../shelter';

export const enableBiometryPasswordSubscription = (
  enableBiometryPassword$: Subject<string>,
  dispatch: Dispatch,
  navigate: (screen: StacksEnum) => void
) =>
  enableBiometryPassword$
    .pipe(
      tap(() => dispatch(showLoaderAction())),
      switchMap(password =>
        Shelter.isPasswordCorrect$(password).pipe(
          switchMap(isPasswordCorrect => (isPasswordCorrect ? Shelter.enableBiometryPassword$(password) : of(false)))
        )
      ),
      tap(() => dispatch(hideLoaderAction()))
    )
    .subscribe(isPasswordSaved => {
      if (isPasswordSaved === false) {
        showErrorToast({ description: 'Wrong password, please, try again' });
      } else {
        showSuccessToast({ description: 'Successfully enabled!' });

        dispatch(setIsBiometricsEnabled(true));
        navigate(StacksEnum.MainStack);
      }
    });
