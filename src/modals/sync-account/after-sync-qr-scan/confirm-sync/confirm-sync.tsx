import { FormikProvider, useFormik } from 'formik';
import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { Label } from 'src/components/label/label';
import { MAX_PASSWORD_ATTEMPTS } from 'src/config/security';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { usePasswordLock } from 'src/hooks/use-password-lock.hook';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { WalletInitFinalStepInputs } from 'src/layouts/wallet-init-final-step-inputs';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { ConfirmSyncFormValues, ConfirmSyncInitialValues, ConfirmSyncValidationSchema } from './confirm-sync.form';
import { ConfirmSyncSelectors } from './confirm-sync.selectors';

interface Props {
  onSubmit: (formValues: ConfirmSyncFormValues) => void;
}

export const ConfirmSync = memo<Props>(({ onSubmit }) => {
  const styles = useSetPasswordScreensCommonStyles();
  const { goBack } = useNavigation();

  const { isDisabled, timeleft } = usePasswordLock();

  useNavigationSetOptions(
    {
      headerTitle: () => <HeaderTitle title="Confirm Sync" />
    },
    []
  );

  usePageAnalytic(ModalsEnum.ConfirmSync);

  const formik = useFormik({
    initialValues: ConfirmSyncInitialValues,
    validationSchema: ConfirmSyncValidationSchema,
    onSubmit
  });

  const { submitForm, isValid, values } = formik;

  return (
    <FormikProvider value={formik}>
      <WalletInitFinalStepInputs
        acceptTermsCheckboxTestID={ConfirmSyncSelectors.acceptTermsCheckbox}
        analyticsCheckboxTestID={ConfirmSyncSelectors.analyticsCheckbox}
        useBiometricsToUnlockCheckBoxTestID={ConfirmSyncSelectors.useAsAppPasswordCheckbox}
        viewAdsCheckboxTestID={ConfirmSyncSelectors.viewAdsCheckbox}
        formik={formik}
      >
        <Divider size={formatSize(12)} />
        <Label label="Password" description="The same password is used to unlock your extension." />
        <FormPasswordInput
          name="password"
          error={
            isDisabled
              ? `You have entered the wrong password ${MAX_PASSWORD_ATTEMPTS} times. Your wallet is being blocked for ${timeleft}`
              : undefined
          }
          testID={ConfirmSyncSelectors.passwordInput}
        />

        <View style={styles.checkboxContainer}>
          <FormCheckbox name="usePrevPassword" testID={ConfirmSyncSelectors.useAsAppPasswordCheckbox} inverted>
            <Divider size={formatSize(8)} />
            <Text style={styles.checkboxText}>Use as App Password</Text>
          </FormCheckbox>
        </View>
      </WalletInitFinalStepInputs>

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary title="Back" onPress={goBack} />
        <ButtonLargePrimary
          title={values.usePrevPassword === true ? 'Sync' : 'Next'}
          disabled={!isValid || isDisabled}
          onPress={useCallbackIfOnline(submitForm)}
          testID={values.usePrevPassword === true ? ConfirmSyncSelectors.syncButton : ConfirmSyncSelectors.nextButton}
        />
      </ModalButtonsFloatingContainer>
    </FormikProvider>
  );
});
