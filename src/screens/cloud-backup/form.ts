import { useDispatch } from 'react-redux';
import { filter, from, map, switchMap, tap } from 'rxjs';
import { object, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { hideLoaderAction, madeCloudBackupAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { showSuccessToast, buildPipeErrorToaster, catchThrowToastError, ToastError } from 'src/toast/toast.utils';
import { fetchCloudBackupFileDetails, requestSignInToCloud, saveCloudBackup } from 'src/utils/cloud-backup';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { useSubjectSubscription$ } from 'src/utils/rxjs.utils';

import { alertOnExistingBackup } from './utils';

interface EnterCloudPasswordFormValues {
  password: string;
}

export const EnterCloudPasswordValidationSchema: SchemaOf<EnterCloudPasswordFormValues> = object().shape({
  password: passwordValidation
});

export const EnterCloudPasswordInitialValues: EnterCloudPasswordFormValues = {
  password: ''
};

export const useHandleSubmit = () => {
  const { goBack, navigate } = useNavigation();
  const dispatch = useDispatch();

  const proceedWithSaving$ = useSubjectSubscription$<string>(
    subject$ =>
      subject$
        .pipe(
          tap(() => dispatch(showLoaderAction())),
          switchMap(password =>
            Shelter.revealSeedPhrase$().pipe(
              switchMap(mnemonic =>
                from(
                  saveCloudBackup(mnemonic, password).catch(catchThrowToastError('Failed to back up to cloud', true))
                )
              ),
              map(() => true),
              buildPipeErrorToaster()
            )
          ),
          tap(() => dispatch(hideLoaderAction())),
          filter(isTruthy)
        )
        .subscribe(() => {
          dispatch(madeCloudBackupAction());
          showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
          goBack();
        }),
    [dispatch, goBack]
  );

  const submit$ = useSubjectSubscription$<string>(
    subject$ =>
      subject$
        .pipe(
          tap(() => dispatch(showLoaderAction())),
          switchMap(password =>
            assurePasswordIsCorrect$(password).pipe(
              switchMap(() => from(requestSignInToCloud().catch(catchThrowToastError('Failed to log-in', true)))),
              filter(isTruthy),
              switchMap(() =>
                from(fetchCloudBackupFileDetails().catch(catchThrowToastError('Failed to read from cloud', true)))
              ),
              map(backupFile => ({ backupFile, password })),
              buildPipeErrorToaster()
            )
          ),
          tap(() => dispatch(hideLoaderAction())),
          filter(isDefined)
        )
        .subscribe(({ backupFile, password }) => {
          if (backupFile) {
            return void alertOnExistingBackup(
              () => void subject$.next(password),
              () => void proceedWithSaving$.next(password),
              () => void navigate(ScreensEnum.ManualBackup)
            );
          }

          return void proceedWithSaving$.next(password);
        }),
    [dispatch, navigate, goBack]
  );

  return ({ password }: EnterCloudPasswordFormValues) => void submit$.next(password);
};

const assurePasswordIsCorrect$ = (password: string) =>
  Shelter.isPasswordCorrect$(password).pipe(
    map(isPasswordCorrect => {
      if (!isPasswordCorrect) {
        throw new ToastError('Wrong password');
      }
    })
  );
