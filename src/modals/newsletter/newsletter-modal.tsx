import axios from 'axios';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { FC, useRef } from 'react';
import { Image, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { object, string } from 'yup';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { FormTextInput } from 'src/form/form-text-input';
import { addNewsletterEmailAction } from 'src/store/newsletter/newsletter-actions';
import { useNewsletterEmailsSelector } from 'src/store/newsletter/newsletter-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';

import { useNewsletterModalStyles } from './newsletter-modal.styles';

const newsletterApi = axios.create({
  baseURL: 'https://jellyfish-app-deove.ondigitalocean.app/'
});

const useEmailValidationSchema = () => {
  const emails = useNewsletterEmailsSelector();

  return object().shape({
    email: string()
      .required('Required field')
      .notOneOf(emails, 'You have already subscribed to the newsletter with this email')
      .email('Invalid email')
  });
};

const initialValues = {
  email: ''
};

export const Newsletter: FC = () => {
  const dispatch = useDispatch();
  const styles = useNewsletterModalStyles();
  const validationSchema = useEmailValidationSchema();
  const formik = useRef<FormikProps<{ email: string }>>(null);

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
      })
      .catch(() => showErrorToast({ description: 'Something went wrong' }));

  return (
    <Formik innerRef={formik} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ submitForm, isSubmitting }) => (
        <>
          <View style={styles.imgContainer}>
            <Image
              source={require('./assets/newsletter-mobile.png')}
              style={{ width: formatSize(360), height: formatSize(274) }}
            />
          </View>
          <ScreenContainer isFullScreenMode>
            <View>
              <Text style={styles.title}>Subscribe to our Newsletter</Text>
              <Text style={styles.subtitle}>Keep up with the latest news from Madfish</Text>
              <FormTextInput name="email" placeholder="example@mail.com" autoCapitalize="none" />
            </View>
          </ScreenContainer>

          <ButtonsFloatingContainer>
            <ButtonLargePrimary title="Subscribe" disabled={isSubmitting} onPress={submitForm} />
            <InsetSubstitute type="bottom" />
          </ButtonsFloatingContainer>
        </>
      )}
    </Formik>
  );
};
