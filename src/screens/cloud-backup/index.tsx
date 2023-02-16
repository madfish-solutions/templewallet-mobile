import { Formik } from 'formik';
import { isString } from 'lodash-es';
import React from 'react';
import { View } from 'react-native';
import RNCloudFs from 'react-native-cloud-fs';
import * as RNFS from 'react-native-fs';

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

import { AesEncryptor } from './aes-encryptor';
import {
  EnterCloudPasswordFormValues,
  EnterCloudPasswordInitialValues,
  EnterCloudPasswordValidationSchema
} from './form';
import { EnterCloudPasswordSelectors } from './selectors';

const CLOUD_WALLET_FOLDER = 'temple-wallet';
const encryptor = new AesEncryptor();

export const CloudBackup = () => {
  usePageAnalytic(ScreensEnum.CloudBackup);

  const { goBack } = useNavigation();

  const styles = useSetPasswordScreensCommonStyles();

  const handleSubmit = async ({ password }: EnterCloudPasswordFormValues) => {
    console.log('Password: ', password);

    const isPasswordCorrect = await new Promise(resolve => {
      Shelter.isPasswordCorrect$(password).subscribe(resolve);
    });

    if (isPasswordCorrect === false) {
      return void showErrorToast({ description: 'Wrong password' });
    }

    let loggedInToCloud = false;
    try {
      loggedInToCloud = isAndroid ? await RNCloudFs.loginIfNeeded() : true;
    } catch (error) {
      console.error('RNCloudFs.loginIfNeeded errored:', { error });
    }

    if (!loggedInToCloud) {
      return void showErrorToast({ description: 'Failed to log-in' });
    }

    const filename = 'wallet-backup.json';

    const targetPath = `${CLOUD_WALLET_FOLDER}/${filename}`;

    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;

    const mnemonic = await new Promise<string>(resolve => Shelter.revealSeedPhrase$().subscribe(m => void resolve(m)));

    const encryptedData = await encryptor.encrypt(password, JSON.stringify(mnemonic));

    await RNFS.writeFile(path, encryptedData, 'utf8');

    let fileId: string | undefined;
    try {
      fileId = await RNCloudFs.copyToCloud({
        mimeType: 'application/json',
        scope: 'hidden',
        sourcePath: { path },
        targetPath
      });
    } catch (error) {
      console.error('RNCloudFs.copyToCloud errored:', { error });
    }

    await RNFS.unlink(path).catch(error => {
      console.error(error);
    });

    if (!isString(fileId)) {
      return void showErrorToast({ description: 'Failed to save file' });
    }

    let fileExists: boolean;
    try {
      fileExists = await RNCloudFs.fileExists(
        isAndroid ? { scope: 'hidden', fileId } : { scope: 'hidden', targetPath }
      );
    } catch (error) {
      console.error('File doesnt exist:', { error });

      return void showErrorToast({ description: 'Failed to save file' });
    }

    if (fileExists === false) {
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
