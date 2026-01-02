import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { FC, useRef } from 'react';
import { Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { newsletterApi } from 'src/apis/newsletter';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { addNewsletterEmailAction } from 'src/store/newsletter/newsletter-actions';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { IMAGE_HEIGHT, IMAGE_URI } from './constants';
import { NewsletterModalSelectors } from './newsletter-modal.selectors';
import { useNewsletterModalStyles } from './newsletter-modal.styles';
import { useNewsletterValidationSchema } from './use-newsletter-validation.hook';

interface FormData {
  email: string;
}

const initialValues: FormData = {
  email: ''
};

const SUSSESS_TOAST_DESCRIPTION = { description: 'Thanks for your subscribing!' };
const ERROR_TOAST_DESCRIPTION = { description: 'Something went wrong' };

export const Newsletter: FC = () => {
  const dispatch = useDispatch();
  const styles = useNewsletterModalStyles();
  const validationSchema = useNewsletterValidationSchema();
  const formik = useRef<FormikProps<{ email: string }>>(null);
  const { goBack } = useNavigation();
  const { trackErrorEvent } = useAnalytics();

  const onSubmit = ({ email }: FormData, formikHelpers: FormikHelpers<FormData>) =>
    newsletterApi
      .post('/', {
        NAME: email,
        EMAIL: email
      })
      .then(() => {
        showSuccessToast(SUSSESS_TOAST_DESCRIPTION);
        dispatch(addNewsletterEmailAction(email));
        formikHelpers.resetForm();
        goBack();
      })
      .catch(error => {
        // TODO: consider removing email from the error event properties
        trackErrorEvent('NewsletterSubscribeError', error, [email]);
        showErrorToast(ERROR_TOAST_DESCRIPTION);
      });

  return (
    <Formik innerRef={formik} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ submitForm, isSubmitting, isValid }) => (
        <>
          <ScreenContainer isFullScreenMode>
            <View>
              <View style={styles.imgContainer}>
                <SvgUri uri={IMAGE_URI} height={IMAGE_HEIGHT} />
              </View>
              <View>
                <Text style={styles.title}>Subscribe to our Newsletter</Text>
                <Text style={styles.subtitle}>Keep up with the latest news from Madfish</Text>
                <FormTextInput
                  name="email"
                  placeholder="example@mail.com"
                  autoCapitalize="none"
                  testID={NewsletterModalSelectors.emailInput}
                />
              </View>
            </View>
          </ScreenContainer>

          <ButtonsFloatingContainer>
            <ButtonLargePrimary
              title="Subscribe"
              disabled={isSubmitting || !isValid}
              onPress={submitForm}
              testID={NewsletterModalSelectors.subscribeButton}
            />
            <InsetSubstitute type="bottom" />
          </ButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
