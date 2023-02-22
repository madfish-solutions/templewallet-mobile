import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import RNCloudFs from 'react-native-cloud-fs';

import { saveCloudBackup } from 'src/cloud-backup';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { isAndroid } from 'src/config/system';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { Shelter } from 'src/shelter/shelter';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import {
  EnterCloudPasswordFormValues,
  EnterCloudPasswordInitialValues,
  EnterCloudPasswordValidationSchema
} from './form';
import { CloudBackupSelectors } from './selectors';

export const CloudBackup = () => {
  usePageAnalytic(ScreensEnum.CloudBackup);

  const { goBack } = useNavigation();

  const styles = useSetPasswordScreensCommonStyles();

  const handleSubmit = async ({ password }: EnterCloudPasswordFormValues) => {
    console.log('Password: ', password);

    const isPasswordCorrect = await new Promise<boolean>(resolve => {
      Shelter.isPasswordCorrect$(password).subscribe(resolve);
    });

    if (isPasswordCorrect === false) {
      return void showErrorToast({ description: 'Wrong password' });
    }

    let loggedInToCloud = false;
    try {
      loggedInToCloud = isAndroid ? await RNCloudFs.loginIfNeeded() : true;
      console.log('RNCloudFs.loginIfNeeded resulted:', loggedInToCloud);
    } catch (error) {
      console.error('RNCloudFs.loginIfNeeded errored:', { error });
    }

    if (!loggedInToCloud) {
      return void showErrorToast({ description: 'Failed to log-in' });
    }

    const mnemonic = await new Promise<string>(resolve => Shelter.revealSeedPhrase$().subscribe(m => void resolve(m)));

    try {
      await saveCloudBackup(mnemonic, password);
    } catch (error) {
      return void showErrorToast({ description: 'Failed to save file' });
    }

    showSuccessToast({ description: 'Your wallet has been backed up successfully!' });
    // navigate(ScreensEnum.);
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
