import { useDispatch } from 'react-redux';
import { from, map, switchMap, tap } from 'rxjs';
import { object, boolean, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { catchThrowToastError, showErrorToastByError } from 'src/toast/toast.utils';
import { fetchCloudBackup, keepRestoredCloudBackup } from 'src/utils/cloud-backup';
import { useSubjectWithReSubscription$ } from 'src/utils/rxjs.utils';

type RestoreFromCloudFormValues = {
  password: string;
  reusePassword: boolean;
};

export const RestoreFromCloudValidationSchema: SchemaOf<RestoreFromCloudFormValues> = object().shape({
  password: passwordValidation,
  reusePassword: boolean().required()
});

export const RestoreFromCloudInitialValues: RestoreFromCloudFormValues = {
  password: '',
  reusePassword: true
};

export const useHandleSubmit = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const submit$ = useSubjectWithReSubscription$<{ password: string; reusePassword: boolean }>(
    subject$ =>
      subject$.pipe(
        tap(() => dispatch(showLoaderAction())),
        switchMap(({ password, reusePassword }) =>
          from(fetchCloudBackup(password).catch(catchThrowToastError("Couldn't restore wallet", true))).pipe(
            map(backup => keepRestoredCloudBackup(backup, reusePassword ? password : undefined))
          )
        ),
        tap(cloudBackupId => {
          dispatch(hideLoaderAction());
          navigate(ScreensEnum.CreateAccount, { cloudBackupId });
        })
      ),
    err => {
      dispatch(hideLoaderAction());
      showErrorToastByError(err);
    },
    [dispatch, navigate]
  );

  return (values: RestoreFromCloudFormValues) => submit$.next(values);
};
