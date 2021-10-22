import { Formik } from 'formik';
import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { AttentionMessage } from '../../../../components/attention-message/attention-message';
import { ButtonLargePrimary } from '../../../../components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from '../../../../components/checkbox-description/checkbox-label';
import { Divider } from '../../../../components/divider/divider';
import { HeaderBackButton } from '../../../../components/header/header-back-button/header-back-button';
import { HeaderTitle } from '../../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../../components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from '../../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../../components/label/label';
import { ScreenContainer } from '../../../../components/screen-container/screen-container';
import { TextLink } from '../../../../components/text-link/text-link';
import { privacyPolicy, termsOfUse } from '../../../../config/socials';
import { FormBiometryCheckbox } from '../../../../form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from '../../../../form/form-checkbox';
import { FormPasswordInput } from '../../../../form/form-password-input';
import { formatSize } from '../../../../styles/format-size';
import { ConfirmSyncFormValues, ConfirmSyncValidationSchema } from './confirm-sync.form';
import { useConfirmSyncStyles } from './confirm-sync.styles';

interface ConfirmSyncProps {
  onSubmit: (formValues: ConfirmSyncFormValues) => void;
}

export const ConfirmSync: FC<ConfirmSyncProps> = ({ onSubmit }) => {
  const styles = useConfirmSyncStyles();

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />,
      headerTitle: () => <HeaderTitle title="Confirm Sync" />
    },
    []
  );

  return (
    <Formik
      initialValues={{
        password: '',
        acceptTerms: false
      }}
      validationSchema={ConfirmSyncValidationSchema}
      onSubmit={onSubmit}
    >
{({ submitForm, isValid, values }) => (
        <ScreenContainer isFullScreenMode={true}>
          <View>
            <Divider size={formatSize(12)} />
            <Label label="Password" description="The same password is used to unlock your extension." />
            <FormPasswordInput name="password" />

            <View style={styles.checkboxContainer}>
              <FormCheckbox name="usePrevPassword">
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Use as App Password</Text>
              </FormCheckbox>
            </View>
            <View style={styles.checkboxContainer}>
              <FormBiometryCheckbox name="useBiometry" />
            </View>
          </View>
          <Divider />
          {values.usePrevPassword && (
            <AttentionMessage title="The password to unlock your mobile temple wallet is the same you set for the extension." />
          )}
          <View>
            <View style={styles.checkboxContainer}>
              <FormCheckbox name="acceptTerms">
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Accept terms</Text>
              </FormCheckbox>
            </View>
            <CheckboxLabel>
              I have read and agree to{'\n'}the <TextLink url={termsOfUse}>Terms of Usage</TextLink> and{' '}
              <TextLink url={privacyPolicy}>Privacy Policy</TextLink>
            </CheckboxLabel>
            <Divider />
            <ButtonLargePrimary
              title={values.usePrevPassword ? 'Sync' : 'Next'}
              disabled={!isValid}
              onPress={submitForm}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
