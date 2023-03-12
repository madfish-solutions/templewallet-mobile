import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { firstValueFrom } from 'rxjs';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { madeCloudBackupAction } from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { requestSignInToCloud, saveCloudBackup } from 'src/utils/cloud-backup';

import {
  EnterCloudPasswordFormValues,
  EnterCloudPasswordInitialValues,
  EnterCloudPasswordValidationSchema
} from './form';
import { CloudBackupSelectors } from './selectors';

export const CloudBackup = () => {
  usePageAnalytic(ScreensEnum.CloudBackup);

  const { goBack } = useNavigation();

  const dispatch = useDispatch();

  const styles = useSetPasswordScreensCommonStyles();

  const handleSubmit = async ({ password }: EnterCloudPasswordFormValues) => {
    const isPasswordCorrect = await firstValueFrom(Shelter.isPasswordCorrect$(password));

    if (!isPasswordCorrect) {
      return void showErrorToast({ description: 'Wrong password' });
    }

    try {
      const loggedInToCloud = await requestSignInToCloud();

      if (!loggedInToCloud) {
        return;
      }
    } catch (error) {
      return void showErrorToast({
        title: 'Failed to log-in',
        description: (error as Error)?.message ?? 'Unknown reason'
      });
    }

    const mnemonic = await new Promise<string>(resolve => Shelter.revealSeedPhrase$().subscribe(m => void resolve(m)));

    try {
      await saveCloudBackup(mnemonic, password);
    } catch (error) {
      return void showErrorToast({
        title: 'Failed to back up to cloud',
        description: (error as Error)?.message ?? ''
      });
    }

    dispatch(madeCloudBackupAction());
    showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
    goBack();
  };

  return (
    <Formik
      initialValues={EnterCloudPasswordInitialValues}
      validationSchema={EnterCloudPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isValid }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Divider size={formatSize(12)} />
              <Label label="Backup password" description="Enter your wallet password to confirm backup." />
              <FormPasswordInput name="password" testID={CloudBackupSelectors.PasswordInput} />
            </View>

            <Disclaimer
              title="Don’t forget your password!"
              texts={[
                'This password will be used for your backup. You will need it in order to restore your wallet from backup in the future.'
              ]}
            />
          </ScreenContainer>

          <View style={styles.fixedButtonContainer}>
            <ButtonLargePrimary
              title="Confirm"
              disabled={!isValid}
              onPress={submitForm}
              testID={CloudBackupSelectors.ConfirmButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
