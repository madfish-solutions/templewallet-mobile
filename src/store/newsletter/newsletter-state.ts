export interface NewsletterState {
  emails: Array<string>;
}

export const newsletterInitialState: NewsletterState = {
  emails: []
};

export interface NewsletterRootState {
  newsletter: NewsletterState;
}
