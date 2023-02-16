import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';
import RNCloudFs from 'react-native-cloud-fs'; // ["copyToCloud", "deleteFromCloud", "fileExists", "getGoogleDriveDocument", "listFiles", "loginIfNeeded", "logout", "requestSignIn", "reset", "getConstants"]

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { Shelter } from 'src/shelter/shelter';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import {
  EnterCloudPasswordFormValues,
  EnterCloudPasswordInitialValues,
  EnterCloudPasswordValidationSchema
} from './form';
import { EnterCloudPasswordSelectors } from './selectors';

export const CloudBackup = () => {
  usePageAnalytic(ScreensEnum.CloudBackup);

  const styles = useSetPasswordScreensCommonStyles();

  const handleSubmit = ({ password }: EnterCloudPasswordFormValues) => {
    console.log('Password: ', password);

    Shelter.isPasswordCorrect$(password).subscribe(isPasswordCorrect => {
      console.log('Is password correct: ', isPasswordCorrect);

      if (isPasswordCorrect === false) {
        return;
      }

      RNCloudFs.loginIfNeeded().then(
        (res: unknown) => {
          console.log('RNCloudFs.loginIfNeeded returned', res);
        },
        (error: unknown) => {
          console.error('RNCloudFs.loginIfNeeded errored:', error);
        }
      );
    });
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
              <Label label="Backup Password" description="Enter your wallet password to confirm backup." />
              <FormPasswordInput name="password" testID={EnterCloudPasswordSelectors.PasswordInput} />
            </View>
          </ScreenContainer>

          <View style={styles.fixedButtonContainer}>
            <ButtonLargePrimary
              title="Confirm"
              disabled={!isValid}
              onPress={submitForm}
              testID={EnterCloudPasswordSelectors.ConfirmButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
