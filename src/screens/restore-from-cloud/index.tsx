import { Formik } from 'formik';
import React from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useHandleSubmit, RestoreFromCloudInitialValues, RestoreFromCloudValidationSchema } from './form';
import { RestoreFromCloudSelectors } from './selectors';

export const RestoreFromCloud = () => {
  usePageAnalytic(ScreensEnum.RestoreFromCloud);

  const handleSubmit = useHandleSubmit();

  const styles = useSetPasswordScreensCommonStyles();

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
