import { useSelector } from '../selector';

export const useNewsletterEmailsSelector = () => useSelector(({ newsletter }) => newsletter.emails);
