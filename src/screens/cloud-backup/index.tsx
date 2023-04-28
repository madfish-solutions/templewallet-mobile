import { Formik } from 'formik';
import React from 'react';
import { View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { EnterCloudPasswordInitialValues, EnterCloudPasswordValidationSchema, useHandleSubmit } from './form';
import { CloudBackupSelectors } from './selectors';

export const CloudBackup = () => {
  usePageAnalytic(ScreensEnum.CloudBackup);

  const styles = useSetPasswordScreensCommonStyles();

  const handleSubmit = useHandleSubmit();

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
