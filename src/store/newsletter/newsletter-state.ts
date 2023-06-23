export interface NewsletterState {
  emails: Array<string>;
  shouldShowNewsletterModal: boolean;
}

export const newsletterInitialState: NewsletterState = {
  emails: [],
  shouldShowNewsletterModal: false
};

export interface NewsletterRootState {
  newsletter: NewsletterState;
}
