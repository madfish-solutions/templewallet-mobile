import { RouteProp, useRoute } from '@react-navigation/core';
import { Formik } from 'formik';
import React from 'react';
import { View, Text } from 'react-native';

import { BackupFileInterface, fetchCloudBackup } from 'src/cloud-backup';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { showErrorToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { ContinueWithCloudFormValues, ContinueWithCloudInitialValues, ContinueWithCloudValidationSchema } from './form';
import { ContinueWithCloudSelectors } from './selectors';

export const ContinueWithCloud = () => {
  usePageAnalytic(ScreensEnum.ContinueWithCloud);

  const { fileId } = useRoute<RouteProp<ScreensParamList, ScreensEnum.ContinueWithCloud>>().params;

  const { navigate } = useNavigation();

  // const { goBack } = useNavigation();

  const styles = useSetPasswordScreensCommonStyles();

  const handleSubmit = async ({ password, reusePassword }: ContinueWithCloudFormValues) => {
    console.log('Password: ', password);

    let backup: BackupFileInterface | undefined;
    try {
      backup = await fetchCloudBackup(password, fileId);
    } catch (error) {
      const description = error instanceof Error ? error.message : "Couldn't restore wallet";

      return void showErrorToast({ description });
    }

    return void navigate(ScreensEnum.CreateAccount, {
      password: reusePassword ? password : undefined,
      mnemonic: backup.mnemonic
    });
  };

  return (
    <Formik
      initialValues={ContinueWithCloudInitialValues}
      validationSchema={ContinueWithCloudValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isValid }) => (
        <>
          <ScreenContainer isFullScreenMode={true}>
            <View>
              <Divider size={formatSize(12)} />
              <Label label="Backup password" description="Enter your backup password to restore a wallet." />
              <FormPasswordInput name="password" testID={ContinueWithCloudSelectors.PasswordInput} />
            </View>

            <View style={[styles.checkboxContainer, styles.removeMargin]}>
              <FormCheckbox name="reusePassword" testID={ContinueWithCloudSelectors.ReusePasswordCheckbox}>
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Use this password as App password</Text>
              </FormCheckbox>
            </View>

            <View style={{ flex: 1 }} />
          </ScreenContainer>

          <View style={styles.fixedButtonContainer}>
            <ButtonLargePrimary
              title="Next"
              disabled={!isValid}
              onPress={submitForm}
              testID={ContinueWithCloudSelectors.SubmitButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
