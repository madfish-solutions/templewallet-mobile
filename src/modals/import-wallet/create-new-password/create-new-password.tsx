import { FormikProvider, useFormik } from 'formik';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { CheckboxLabel } from 'src/components/checkbox-description/checkbox-label';
import { Divider } from 'src/components/divider/divider';
import { AnalyticsField } from 'src/components/fields/analytics-field';
import { ViewAdsField } from 'src/components/fields/view-ads-field';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextLink } from 'src/components/text-link/text-link';
import { privacyPolicy, termsOfUse } from 'src/config/socials';
import { FormBiometryCheckbox } from 'src/form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from 'src/form/form-checkbox';
import { FormPasswordInput } from 'src/form/form-password-input';
import { useNoInternetWarningToast } from 'src/hooks/use-no-internet-warning-toast';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { setAdsBannerVisibilityAction, setIsAnalyticsEnabled } from 'src/store/settings/settings-actions';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { showWarningToast } from 'src/toast/toast.utils';
import { scrollToField } from 'src/utils/form.utils';
import { isString } from 'src/utils/is-string';

import { createNewPasswordValidationSchema, CreateNewPasswordFormValues } from './create-new-password.form';
import { CreateNewPasswordSelectors } from './create-new-password.selectors';

interface Props {
  initialPassword?: string;
  onGoBackPress: EmptyFn;
  seedPhrase: string;
}

export const CreateNewPassword = memo<Props>(({ onGoBackPress, seedPhrase, initialPassword = '' }) => {
  const dispatch = useDispatch();

  const handleNoInternet = useNoInternetWarningToast();

  const styles = useSetPasswordScreensCommonStyles();
  const { importWallet } = useShelter();

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Create Password" /> }, []);

  const refScrollView = useRef<ScrollView>(null);
  const [fieldsPositions, setFieldsPositions] = useState({
    password: 0,
    acceptTerms: 0
  });

  const handleSubmit = useCallback(({ password, useBiometry, analytics, viewAds }: CreateNewPasswordFormValues) => {
    if (viewAds) {
      dispatch(togglePartnersPromotionAction(true));
      dispatch(setAdsBannerVisibilityAction(false));
    }
    dispatch(setIsAnalyticsEnabled(analytics));
    importWallet({ seedPhrase, password, useBiometry });
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

  const formik = useFormik({
    initialValues: createNewPasswordInitialValues,
    validationSchema: createNewPasswordValidationSchema,
    onSubmit: handleSubmit
  });

  const { submitForm, errors, setFieldTouched, isValid } = formik;

  useEffect(() => {
    if (isString(initialPassword)) {
      showWarningToast({
        description: 'The password from the previous screen was used'
      });
    }
  }, []);

  const handleLayoutChange = useCallback(
    (name: string, value: number) => setFieldsPositions(prevState => ({ ...prevState, [name]: value })),
    []
  );

  return (
    <FormikProvider value={formik}>
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
            <FormCheckbox
              name="acceptTerms"
              descriptionNode={
                <>
                  <Divider size={formatSize(8)} />
                  <CheckboxLabel>
                    I have read and agree to{'\n'}the <TextLink url={termsOfUse}>Terms of Use</TextLink> and{' '}
                    <TextLink url={privacyPolicy}>Privacy Policy</TextLink>
                  </CheckboxLabel>
                </>
              }
              testID={CreateNewPasswordSelectors.acceptTermsCheckbox}
            >
              <Divider size={formatSize(8)} />
              <Text style={styles.checkboxText}>Accept terms</Text>
            </FormCheckbox>
          </View>
        </View>
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonsContainer style={styles.buttonsContainer}>
          <View style={styles.flex}>
            <ButtonLargeSecondary title="Back" onPress={onGoBackPress} />
          </View>
          <Divider size={formatSize(15)} />
          <View style={styles.flex}>
            <ButtonLargePrimary
              title="Import"
              disabled={!isValid}
              onPress={handleNoInternet(() => {
                setFieldTouched('password', true, true);
                setFieldTouched('passwordConfirmation', true, true);
                setFieldTouched('acceptTerms', true, true);

                scrollToField(refScrollView, errors, fieldsPositions);

                if (isValid) {
                  submitForm();
                }
              })}
              testID={CreateNewPasswordSelectors.createButton}
            />
          </View>
        </ButtonsContainer>
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </FormikProvider>
  );
});
