import { Formik } from 'formik';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

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
import { MaxPasswordAttemtps } from '../../../../config/system';
import { FormBiometryCheckbox } from '../../../../form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from '../../../../form/form-checkbox';
import { FormPasswordInput } from '../../../../form/form-password-input';
import { setPasswordTimelock } from '../../../../store/security/security-actions';
import { usePasswordAttempt, usePasswordTimelock } from '../../../../store/security/security-selectors';
import { formatSize } from '../../../../styles/format-size';
import { ConfirmSyncFormValues, ConfirmSyncValidationSchema } from './confirm-sync.form';
import { useConfirmSyncStyles } from './confirm-sync.styles';

const LOCK_TIME = 5_000;

const checkTime = (i: number) => (i < 10 ? '0' + i : i);

const getTimeLeft = (start: number, end: number) => {
  const isPositiveTime = start + end - Date.now() < 0 ? 0 : start + end - Date.now();
  const diff = isPositiveTime / 1000;
  const seconds = Math.floor(diff % 60);
  const minutes = Math.floor(diff / 60);

  return `${checkTime(minutes)}:${checkTime(seconds)}`;
};

interface ConfirmSyncProps {
  onSubmit: (formValues: ConfirmSyncFormValues) => void;
}

export const ConfirmSync: FC<ConfirmSyncProps> = ({ onSubmit }) => {
  const styles = useConfirmSyncStyles();

  const dispatch = useDispatch();
  const timelock = usePasswordTimelock();
  const attempt = usePasswordAttempt();
  const lockLevel = LOCK_TIME * Math.floor(attempt / 3);
  const [timeleft, setTimeleft] = useState(getTimeLeft(timelock, lockLevel));
  const isDisabled = useMemo(() => Date.now() - timelock <= lockLevel, [timelock, lockLevel]);

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />,
      headerTitle: () => <HeaderTitle title="Confirm Sync" />
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - timelock > lockLevel) {
        dispatch(setPasswordTimelock.submit(0));
      }
      setTimeleft(getTimeLeft(timelock, lockLevel));
    }, 1_000);

    return () => {
      clearInterval(interval);
    };
  }, [timelock, lockLevel]);

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
            {isDisabled ? (
              <Text style={styles.passwordBlocked}>
                You have entered the wrong password {MaxPasswordAttemtps} times. Your synchronization is being blocked
                for {timeleft}
              </Text>
            ) : (
              <FormPasswordInput name="password" />
            )}

            <View style={styles.checkboxContainer}>
              <FormCheckbox name="usePrevPassword">
                <Divider size={formatSize(8)} />
                <Text style={styles.checkboxText}>Use as App Password</Text>
              </FormCheckbox>
            </View>

            <View style={styles.checkboxContainer}>
              <FormBiometryCheckbox name="useBiometry" />
            </View>

            {values.usePrevPassword === true && (
              <AttentionMessage title="The password to unlock your mobile temple wallet is the same you set for the extension." />
            )}
          </View>
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
              title={values.usePrevPassword === true ? 'Sync' : 'Next'}
              disabled={!isValid || isDisabled}
              onPress={submitForm}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </ScreenContainer>
      )}
    </Formik>
  );
};
