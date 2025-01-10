import { useFormik } from 'formik';
import React, { ReactNode, RefObject } from 'react';
import { LayoutChangeEvent, ScrollView, Text, View } from 'react-native';

import { CheckboxGroup } from 'src/components/checkbox-group';
import { CheckboxGroupItem } from 'src/components/checkbox-group-item';
import { Divider } from 'src/components/divider/divider';
import { AnalyticsField } from 'src/components/fields/analytics-field';
import { ViewAdsField } from 'src/components/fields/view-ads-field';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { privacyPolicy, termsOfUse } from 'src/config/socials';
import { FormBiometryCheckbox } from 'src/form/form-biometry-checkbox/form-biometry-checkbox';
import { FormCheckbox } from 'src/form/form-checkbox';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { openUrl } from 'src/utils/linking';

export interface WalletInitFormValuesBase {
  acceptTerms: boolean;
  analytics: boolean;
  viewAds: boolean;
  useBiometry?: boolean;
}

export interface WalletInitFinalStepInputsProps<T extends WalletInitFormValuesBase> {
  acceptTermsCheckboxTestID: string;
  analyticsCheckboxTestID: string;
  useBiometricsToUnlockCheckBoxTestID: string;
  viewAdsCheckboxTestID: string;
  formik: ReturnType<typeof useFormik<T>>;
  refScrollView?: RefObject<ScrollView>;
  children?: ReactNode | ReactNode[];
  onMainPartLayout?: (event: LayoutChangeEvent) => void;
  onAcceptTermsLayout?: (event: LayoutChangeEvent) => void;
}

const viewAdsAlertParams = {
  title: 'Earn Rewards with Ads',
  message: 'I agree to share my wallet address and IP to receive ads and rewards in TKEY token.',
  buttons: [{ text: 'Ok', isPreferred: true }]
};

const analyticsAlertParams = {
  title: 'Usage Analytics',
  message: 'I agree to the anonymous analytics collecting',
  buttons: [
    { text: 'Anonymous analytics', onPress: () => openUrl(privacyPolicy) },
    { text: 'Ok', isPreferred: true }
  ]
};

const termsAlertParams = {
  title: 'Accept Terms',
  message: 'I have read and agree to the\nTerms of Usage and Privacy Policy',
  buttons: [
    { text: 'Terms of Usage', onPress: () => openUrl(termsOfUse) },
    { text: 'Privacy Policy', onPress: () => openUrl(privacyPolicy) },
    { text: 'Cancel', isPreferred: true }
  ]
};

export const WalletInitFinalStepInputs = <T extends WalletInitFormValuesBase>({
  acceptTermsCheckboxTestID,
  analyticsCheckboxTestID,
  useBiometricsToUnlockCheckBoxTestID,
  viewAdsCheckboxTestID,
  formik,
  refScrollView,
  children,
  onMainPartLayout,
  onAcceptTermsLayout
}: WalletInitFinalStepInputsProps<T>) => {
  const styles = useSetPasswordScreensCommonStyles();
  const { errors, touched } = formik;

  return (
    <ScreenContainer scrollViewRef={refScrollView} isFullScreenMode={true}>
      <View style={styles.flex} onLayout={onMainPartLayout}>
        {children}
      </View>

      <CheckboxGroup isError={Boolean(touched.useBiometry && errors.useBiometry)}>
        <CheckboxGroupItem>
          <FormBiometryCheckbox name="useBiometry" testID={useBiometricsToUnlockCheckBoxTestID} />
        </CheckboxGroupItem>

        <CheckboxGroupItem infoAlertArgs={viewAdsAlertParams}>
          <ViewAdsField name="viewAds" testID={viewAdsCheckboxTestID} />
        </CheckboxGroupItem>

        <CheckboxGroupItem infoAlertArgs={analyticsAlertParams}>
          <AnalyticsField name="analytics" testID={analyticsCheckboxTestID} />
        </CheckboxGroupItem>
      </CheckboxGroup>

      <Divider size={formatSize(16)} />

      <CheckboxGroup onLayout={onAcceptTermsLayout} isError={Boolean(touched.acceptTerms && errors.acceptTerms)}>
        <CheckboxGroupItem infoAlertArgs={termsAlertParams}>
          <FormCheckbox name="acceptTerms" inverted testID={acceptTermsCheckboxTestID} shouldShowError={false}>
            <Divider size={formatSize(4)} />
            <Text style={styles.checkboxText}>Accept Terms</Text>
          </FormCheckbox>
        </CheckboxGroupItem>
      </CheckboxGroup>

      <Divider size={formatSize(16)} />
    </ScreenContainer>
  );
};
