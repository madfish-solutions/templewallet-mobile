import { FormikProvider, useFormik } from 'formik';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { WalletInitButtonsFloatingContainer } from 'src/layouts/wallet-init-buttons-floating-container';
import { WalletInitNewPasswordInputs } from 'src/layouts/wallet-init-new-password-inputs';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { useRestoredCloudBackup } from 'src/utils/cloud-backup';
import { scrollToField } from 'src/utils/form.utils';
import { isString } from 'src/utils/is-string';

import {
  BackupFlow,
  createNewPasswordInitialValues,
  createNewPasswordValidationSchema,
  useHandleSubmit
} from './create-new-wallet.form';
import { CreateNewWalletSelectors } from './create-new-wallet.selectors';

export const CreateNewWallet = () => {
  const { backupToCloud, cloudBackupId } = useScreenParams<ScreensEnum.CreateAccount>();

  const { mnemonic: cloudBackupMnemonic, password: cloudBackupPassword } = useRestoredCloudBackup(cloudBackupId);

  let backupFlow: BackupFlow | undefined;
  if (isString(cloudBackupMnemonic)) {
    backupFlow = {
      type: 'RESTORE',
      mnemonic: cloudBackupMnemonic
    };
  } else if (backupToCloud === true) {
    backupFlow = { type: 'AUTO_BACKUP' };
  }

  useNavigationSetOptions(
    {
      headerTitle: () => (
        <HeaderTitle title={backupFlow?.type === 'RESTORE' ? 'Create a new password' : 'Create a new Wallet'} />
      )
    },
    [backupFlow?.type]
  );

  const refScrollView = useRef<ScrollView>(null);
  const [fieldsPositions, setFieldsPositions] = useState({
    password: 0,
    acceptTerms: 0
  });

  const initialValues = useMemo(
    () =>
      isString(cloudBackupPassword)
        ? {
            ...createNewPasswordInitialValues,
            password: cloudBackupPassword,
            passwordConfirmation: cloudBackupPassword
          }
        : createNewPasswordInitialValues,
    [cloudBackupPassword]
  );

  const handleSubmit = useHandleSubmit(backupFlow);

  const formik = useFormik({
    initialValues,
    validationSchema: createNewPasswordValidationSchema,
    onSubmit: handleSubmit
  });

  const { submitForm, setFieldTouched, isValid, errors } = formik;

  const handleLayoutChange = useCallback(
    (name: string, value: number) => setFieldsPositions(prevState => ({ ...prevState, [name]: value })),
    []
  );
  const handleMainPartLayout = useCallback(
    (event: LayoutChangeEvent) => handleLayoutChange('password', event.nativeEvent.layout.y),
    [handleLayoutChange]
  );
  const handleAcceptTermsLayout = useCallback(
    (event: LayoutChangeEvent) => handleLayoutChange('acceptTerms', event.nativeEvent.layout.y),
    [handleLayoutChange]
  );

  return (
    <FormikProvider value={formik}>
      <WalletInitNewPasswordInputs
        passwordInputTestID={CreateNewWalletSelectors.passwordInput}
        repeatPasswordInputTestID={CreateNewWalletSelectors.repeatPasswordInput}
        acceptTermsCheckboxTestID={CreateNewWalletSelectors.acceptTermsCheckbox}
        analyticsCheckboxTestID={CreateNewWalletSelectors.analyticsCheckbox}
        useBiometricsToUnlockCheckBoxTestID={CreateNewWalletSelectors.useBiometricsToUnlockCheckBox}
        viewAdsCheckboxTestID={CreateNewWalletSelectors.viewAdsCheckbox}
        formik={formik}
        refScrollView={refScrollView}
        onMainPartLayout={handleMainPartLayout}
        onAcceptTermsLayout={handleAcceptTermsLayout}
      />

      <WalletInitButtonsFloatingContainer>
        <ButtonLargePrimary
          title="Create"
          onPress={useCallbackIfOnline(() => {
            setFieldTouched('password', true, true);
            setFieldTouched('passwordConfirmation', true, true);
            setFieldTouched('acceptTerms', true, true);

            scrollToField(refScrollView, errors, fieldsPositions);

            if (isValid) {
              submitForm();
            }
          })}
          testID={CreateNewWalletSelectors.createButton}
        />
      </WalletInitButtonsFloatingContainer>
    </FormikProvider>
  );
};
