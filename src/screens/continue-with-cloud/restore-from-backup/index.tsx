import { Formik } from 'formik';
import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { hideLoaderAction, showLoaderAction } from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { catchThrowToastError, showErrorToastByError } from 'src/toast/toast.utils';
import { keepRestoredCloudBackup, EncryptedBackupObject, decryptCloudBackup } from 'src/utils/cloud-backup';
import { useCloudAnalytics } from 'src/utils/cloud-backup/use-cloud-analytics';

import { RestoreFromCloudFormValues, RestoreFromCloudInitialValues, RestoreFromCloudValidationSchema } from './form';
import { RestoreFromCloudSelectors } from './selectors';

interface Props {
  encryptedBackup: EncryptedBackupObject;
}

export const RestoreFromCloud = ({ encryptedBackup }: Props) => {
  const navigateToScreen = useNavigateToScreen();
  const dispatch = useDispatch();
  const { trackCloudError, trackCloudSuccess } = useCloudAnalytics();

  const styles = useSetPasswordScreensCommonStyles();

  const handleSubmit = useCallback(
    async ({ password, reusePassword }: RestoreFromCloudFormValues) => {
      try {
        dispatch(showLoaderAction());

        const backup = await decryptCloudBackup(encryptedBackup, password).catch(
          catchThrowToastError("Couldn't restore wallet", true)
        );

        const cloudBackupId = keepRestoredCloudBackup(backup, reusePassword ? password : undefined);

        dispatch(hideLoaderAction());

        navigateToScreen({ screen: ScreensEnum.CreateAccount, params: { cloudBackupId } });

        trackCloudSuccess('Wallet was restored');
      } catch (error) {
        dispatch(hideLoaderAction());
        showErrorToastByError(error);

        trackCloudError(error);
      }
    },
    [encryptedBackup, dispatch, navigateToScreen, trackCloudError, trackCloudSuccess]
  );

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
