import { useSelector } from '../selector';

export const useNewsletterEmailsSelector = () => useSelector(({ newsletter }) => newsletter.emails);
export const useShouldShowNewsletterModalSelector = () =>
  useSelector(({ newsletter }) => newsletter.shouldShowNewsletterModal);
export const useNewsletterModalWasClosedSelector = () =>
  useSelector(({ newsletter }) => newsletter.newsletterModalWasClosed);
