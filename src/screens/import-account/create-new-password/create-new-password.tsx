import { Formik } from 'formik';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AnalyticsField } from 'src/components/fields/analytics-field';
import { ViewAdsField } from 'src/components/fields/view-ads-field';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { scrollToField } from 'src/utils/form.utils';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { CheckboxLabel } from '../../../components/checkbox-description/checkbox-label';
import { Divider } from '../../../components/divider/divider';
import { HeaderButton } from '../../../components/header/header-button/header-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { Label } from '../../../components/label/label';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { TextLink } from '../../../components/text-link/text-link';
import { EmptyFn } from '../../../config/general';
import { privacyPolicy, termsOfUse } from '../../../config/socials';
import { FormBiometryCheckbox } from '../../../form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from '../../../form/form-checkbox';
import { FormPasswordInput } from '../../../form/form-password-input';
import { useShelter } from '../../../shelter/use-shelter.hook';
import { setAdsBannerVisibilityAction, setIsAnalyticsEnabled } from '../../../store/settings/settings-actions';
import { formatSize } from '../../../styles/format-size';
import { useSetPasswordScreensCommonStyles } from '../../../styles/set-password-screens-common-styles';
import { showWarningToast } from '../../../toast/toast.utils';
import { isString } from '../../../utils/is-string';

import { createNewPasswordValidationSchema, CreateNewPasswordFormValues } from './create-new-password.form';
import { CreateNewPasswordSelectors } from './create-new-password.selectors';

interface CreateNewPasswordProps {
  initialPassword?: string;
  onGoBackPress: EmptyFn;
  seedPhrase: string;
}

export const CreateNewPassword: FC<CreateNewPasswordProps> = ({ onGoBackPress, seedPhrase, initialPassword = '' }) => {
  const dispatch = useDispatch();

  const styles = useSetPasswordScreensCommonStyles();
  const { importWallet } = useShelter();

  const refScrollView = useRef<ScrollView>(null);
  const [fieldsPositions, setFieldsPositions] = useState({
    password: 0,
    acceptTerms: 0
  });

  const handleSubmit = ({ password, useBiometry, analytics, viewAds }: CreateNewPasswordFormValues) => {
    if (viewAds) {
      dispatch(togglePartnersPromotionAction(true));
      dispatch(setAdsBannerVisibilityAction(false));
    }
    dispatch(setIsAnalyticsEnabled(analytics));
    importWallet({ seedPhrase, password, useBiometry });
  };

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderButton iconName={IconNameEnum.ArrowLeft} onPress={onGoBackPress} />,
      headerTitle: () => <HeaderTitle title="Create a new password" />
    },
    [onGoBackPress]
  );

  useEffect(() => {
    if (isString(initialPassword)) {
      showWarningToast({
        description: 'The password from the previous screen was used'
      });
    }
  }, []);

  const createNewPasswordInitialValues = useMemo(
    () => ({
      password: initialPassword,
      passwordConfirmation: initialPassword,
      acceptTerms: false,
      analytics: true,
      viewAds: true
    }),
    [initialPassword]
  );

  const handleLayoutChange = (name: string, value: number) =>
    setFieldsPositions(prevState => ({ ...prevState, [name]: value }));

  return (
    <Formik
      initialValues={createNewPasswordInitialValues}
      validationSchema={createNewPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm, errors, setFieldTouched, isValid }) => (
        <>
          <ScreenContainer scrollViewRef={refScrollView} isFullScreenMode={true}>
            <View style={styles.mb40} onLayout={event => handleLayoutChange('password', event.nativeEvent.layout.y)}>
              <Divider size={formatSize(12)} />
              <View>
                <Label label="Password" description="A password is used to protect the wallet." />
                <FormPasswordInput
                  isShowPasswordStrengthIndicator
                  name="password"
                  testID={CreateNewPasswordSelectors.passwordInput}
                />
              </View>

              <Label label="Repeat Password" description="Please enter the password again." />
              <FormPasswordInput name="passwordConfirmation" testID={CreateNewPasswordSelectors.repeatPasswordInput} />

              <View style={styles.checkboxContainer} testID={CreateNewPasswordSelectors.useBiometricsToUnlockCheckBox}>
                <FormBiometryCheckbox name="useBiometry" />
              </View>

              <AnalyticsField name="analytics" testID={CreateNewPasswordSelectors.analyticsCheckbox} />
              <Divider size={formatSize(24)} />
              <ViewAdsField name="viewAds" testID={CreateNewPasswordSelectors.viewAdsCheckbox} />
            </View>

            <View onLayout={event => handleLayoutChange('acceptTerms', event.nativeEvent.layout.y)}>
              <View style={styles.checkboxContainer}>
                <FormCheckbox name="acceptTerms" testID={CreateNewPasswordSelectors.acceptTermsCheckbox}>
                  <Divider size={formatSize(8)} />
                  <Text style={styles.checkboxText}>Accept terms</Text>
                </FormCheckbox>
              </View>
              <CheckboxLabel>
                I have read and agree to{'\n'}the <TextLink url={termsOfUse}>Terms of Use</TextLink> and{' '}
                <TextLink url={privacyPolicy}>Privacy Policy</TextLink>
              </CheckboxLabel>
            </View>
          </ScreenContainer>
          <View style={styles.fixedButtonContainer}>
            <ButtonLargePrimary
              title="Create"
              onPress={() => {
                setFieldTouched('password', true, true);
                setFieldTouched('passwordConfirmation', true, true);
                setFieldTouched('acceptTerms', true, true);

                scrollToField(refScrollView, errors, fieldsPositions);

                if (isValid) {
                  submitForm();
                }
              }}
              testID={CreateNewPasswordSelectors.createButton}
            />
            <InsetSubstitute type="bottom" />
          </View>
        </>
      )}
    </Formik>
  );
};
