import { Formik } from 'formik';
// import { isString } from 'lodash-es';
import React from 'react';
import { View } from 'react-native';
// import RNCloudFs from 'react-native-cloud-fs';
// import * as RNFS from 'react-native-fs';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
// import { isAndroid } from 'src/config/system';
import { FormPasswordInput } from 'src/form/form-password-input';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
// import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
// import { Shelter } from 'src/shelter/shelter';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
// import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

// import PackageJSON from '../../../package.json';
// import { AesEncryptor } from './aes-encryptor';
import {
  EnterCloudPasswordFormValues,
  EnterCloudPasswordInitialValues,
  EnterCloudPasswordValidationSchema
} from './form';
import { EnterCloudPasswordSelectors } from './selectors';

// const CLOUD_WALLET_FOLDER = 'temple-wallet';
// const encryptor = new AesEncryptor();

export const ContinueWithCloud = () => {
  usePageAnalytic(ScreensEnum.CloudBackup);

  // const { goBack } = useNavigation();

  const styles = useSetPasswordScreensCommonStyles();

  const handleSubmit = async ({ password }: EnterCloudPasswordFormValues) => {
    console.log('Password: ', password);

    //
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
              <Label label="Backup Password" description="Enter your backup password to restore a wallet." />
              <FormPasswordInput name="password" testID={EnterCloudPasswordSelectors.PasswordInput} />
            </View>
          </ScreenContainer>

          <View style={styles.fixedButtonContainer}>
            <ButtonLargePrimary
              title="Next"
              disabled={!isValid}
              onPress={submitForm}
              testID={EnterCloudPasswordSelectors.SubmitButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
