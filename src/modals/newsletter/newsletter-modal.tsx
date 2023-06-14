import axios from 'axios';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { FC, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { addNewsletterEmailAction, shouldShowNewsletterModalAction } from 'src/store/newsletter/newsletter-actions';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';

import { IMAGE_HEIGHT, IMAGE_URI } from './constants';
import { NewsletterModalSelectors } from './newsletter-modal.selectors';
import { useNewsletterModalStyles } from './newsletter-modal.styles';
import { useNewsletterValidationSchema } from './use-newsletter-validation.hook';

const newsletterApi = axios.create({
  baseURL: 'https://jellyfish-app-deove.ondigitalocean.app/'
});

const initialValues = {
  email: ''
};

export const Newsletter: FC = () => {
  const dispatch = useDispatch();
  const styles = useNewsletterModalStyles();
  const validationSchema = useNewsletterValidationSchema();
  const formik = useRef<FormikProps<{ email: string }>>(null);
  const { goBack } = useNavigation();

  useEffect(() => () => void dispatch(shouldShowNewsletterModalAction(false)), []);

  const onSubmit = ({ email }: { email: string }, formikHelpers: FormikHelpers<{ email: string }>) =>
    newsletterApi
      .post('https://jellyfish-app-deove.ondigitalocean.app/', {
        NAME: email,
        EMAIL: email
      })
      .then(() => {
        showSuccessToast({ description: 'Thanks for your subscribing!' });
        dispatch(addNewsletterEmailAction(email));
        formikHelpers.resetForm();
        goBack();
      })
      .catch(() => showErrorToast({ description: 'Something went wrong' }));

  return (
    <Formik innerRef={formik} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ submitForm, isSubmitting }) => (
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
              disabled={isSubmitting}
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
