import { FormikProvider, useFormik } from 'formik';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { useCallbackIfOnline } from 'src/hooks/use-callback-if-online';
import { WalletInitButtonsFloatingContainer } from 'src/layouts/wallet-init-buttons-floating-container';
import { WalletInitNewPasswordInputs } from 'src/layouts/wallet-init-new-password-inputs';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { setIsAnalyticsEnabled } from 'src/store/settings/settings-actions';
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

  const { importWallet } = useShelter();

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Create Password" /> }, []);

  const refScrollView = useRef<ScrollView>(null);
  const [fieldsPositions, setFieldsPositions] = useState({
    password: 0,
    acceptTerms: 0
  });

  const handleSubmit = useCallback(
    ({ password, useBiometry, analytics, viewAds }: CreateNewPasswordFormValues) => {
      dispatch(togglePartnersPromotionAction(viewAds));
      dispatch(setIsAnalyticsEnabled(analytics));

      importWallet({ seedPhrase, password, useBiometry });
    },
    [seedPhrase]
  );

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

  const formik = useFormik<CreateNewPasswordFormValues>({
    initialValues: createNewPasswordInitialValues,
    validationSchema: createNewPasswordValidationSchema,
    onSubmit: handleSubmit
  });

  const { submitForm, errors, setFieldTouched, isValid, touched } = formik;
  const disableImport = useMemo(
    () => Object.keys(errors).filter(key => touched[key as keyof CreateNewPasswordFormValues]).length > 0,
    [errors, touched]
  );

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
        passwordInputTestID={CreateNewPasswordSelectors.passwordInput}
        repeatPasswordInputTestID={CreateNewPasswordSelectors.repeatPasswordInput}
        acceptTermsCheckboxTestID={CreateNewPasswordSelectors.acceptTermsCheckbox}
        analyticsCheckboxTestID={CreateNewPasswordSelectors.analyticsCheckbox}
        useBiometricsToUnlockCheckBoxTestID={CreateNewPasswordSelectors.useBiometricsToUnlockCheckBox}
        viewAdsCheckboxTestID={CreateNewPasswordSelectors.viewAdsCheckbox}
        formik={formik}
        refScrollView={refScrollView}
        onMainPartLayout={handleMainPartLayout}
        onAcceptTermsLayout={handleAcceptTermsLayout}
      />

      <WalletInitButtonsFloatingContainer>
        <ButtonLargeSecondary title="Back" onPress={onGoBackPress} />
        <ButtonLargePrimary
          title="Import"
          disabled={disableImport}
          onPress={useCallbackIfOnline(() => {
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
      </WalletInitButtonsFloatingContainer>
    </FormikProvider>
  );
});
