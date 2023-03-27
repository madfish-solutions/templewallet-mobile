import { RouteProp, useRoute } from '@react-navigation/core';
import { useDispatch } from 'react-redux';
import { catchError, filter, from, map, switchMap, tap } from 'rxjs';
import { object, boolean, SchemaOf } from 'yup';

import { passwordValidation } from 'src/form/validation/password';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { buildErrorToaster$, catchThrowToastError } from 'src/toast/toast.utils';
import { fetchCloudBackup, keepRestoredCloudBackup } from 'src/utils/cloud-backup';
import { isDefined } from 'src/utils/is-defined';
import { useSubjectSubscription$ } from 'src/utils/rxjs.utils';

export type RestoreFromCloudFormValues = {
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
  const { fileId } = useRoute<RouteProp<ScreensParamList, ScreensEnum.RestoreFromCloud>>().params;

  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const submit$ = useSubjectSubscription$<{ password: string; fileId: string; reusePassword: boolean }>(
    subject$ =>
      subject$
        .pipe(
          tap(() => dispatch(showLoaderAction())),
          switchMap(({ password, fileId, reusePassword }) =>
            from(fetchCloudBackup(password, fileId)).pipe(
              catchThrowToastError("Couldn't restore wallet", true),
              map(backup => keepRestoredCloudBackup(backup, reusePassword ? password : undefined)),
              catchError(buildErrorToaster$())
            )
          ),
          tap(() => dispatch(hideLoaderAction())),
          filter(isDefined)
        )
        .subscribe(cloudBackupId => void navigate(ScreensEnum.CreateAccount, { cloudBackupId })),
    [fileId, dispatch, navigate]
  );

  const handleSubmit = ({ password, reusePassword }: RestoreFromCloudFormValues) =>
    submit$.next({ password, fileId, reusePassword });

  return handleSubmit;
};
