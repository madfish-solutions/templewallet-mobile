import { Formik } from 'formik';
import React from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { from, map, switchMap, tap } from 'rxjs';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { ToastError, catchThrowToastError, showErrorToastByError } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { cloudTitle, keepRestoredCloudBackup, EncryptedBackupObject, decryptCloudBackup } from 'src/utils/cloud-backup';
import { useSubjectWithReSubscription$ } from 'src/utils/rxjs.utils';

import { RestoreFromCloudFormValues, RestoreFromCloudInitialValues, RestoreFromCloudValidationSchema } from './form';
import { RestoreFromCloudSelectors } from './selectors';

interface Props {
  encryptedBackup: EncryptedBackupObject;
}

export const RestoreFromCloud = ({ encryptedBackup }: Props) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  const styles = useSetPasswordScreensCommonStyles();

  const submit$ = useSubjectWithReSubscription$<{ password: string; reusePassword: boolean }>(
    subject$ =>
      subject$.pipe(
        tap(() => dispatch(showLoaderAction())),
        switchMap(({ password, reusePassword }) =>
          from(
            decryptCloudBackup(encryptedBackup, password).catch(catchThrowToastError("Couldn't restore wallet", true))
          ).pipe(map(backup => keepRestoredCloudBackup(backup, reusePassword ? password : undefined)))
        ),
        tap(cloudBackupId => {
          dispatch(hideLoaderAction());
          navigate(ScreensEnum.CreateAccount, { cloudBackupId });
        })
      ),
    error => {
      dispatch(hideLoaderAction());
      showErrorToastByError(error);

      const errorTitle = error instanceof ToastError ? error.title : undefined;
      trackEvent('CLOUD_ERROR', AnalyticsEventCategory.General, { cloudTitle, errorTitle });
    },
    [encryptedBackup, dispatch, navigate, trackEvent]
  );

  const handleSubmit = (values: RestoreFromCloudFormValues) => submit$.next(values);

  return (
    <Formik
      initialValues={RestoreFromCloudInitialValues}
      validationSchema={RestoreFromCloudValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isValid }) => (
        <>
          <ScreenContainer>
            <View>
              <Divider size={formatSize(12)} />
              <Label label="Backup password" description="Enter your backup password to restore a wallet." />
              <FormPasswordInput name="password" testID={RestoreFromCloudSelectors.passwordInput} />
            </View>

            <View style={[styles.checkboxContainer, styles.removeMargin]}>
              <FormCheckbox name="reusePassword" testID={RestoreFromCloudSelectors.reusePasswordCheckbox}>
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Use this password as App password</Text>
              </FormCheckbox>
            </View>
          </ScreenContainer>

          <View style={styles.fixedButtonContainer}>
            <ButtonLargePrimary
              title="Next"
              disabled={!isValid}
              onPress={submitForm}
              testID={RestoreFromCloudSelectors.submitButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
