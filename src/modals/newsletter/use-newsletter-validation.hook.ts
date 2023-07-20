import { object, string } from 'yup';

import { useNewsletterEmailsSelector } from 'src/store/newsletter/newsletter-selectors';

export const useNewsletterValidationSchema = () => {
  const emails = useNewsletterEmailsSelector();

  return object().shape({
    email: string()
      .required('Required field')
      .notOneOf(emails, 'You have already subscribed to the newsletter with this email')
      .email('Invalid email')
  });
};
