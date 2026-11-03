export interface NewsletterState {
  emails: Array<string>;
  shouldShowNewsletterModal: boolean;
  // Persisted. Survives an app stop between the newsletter modal closing and the on-ramp overlay opening.
  // Reset when that overlay is dismissed.
  newsletterModalWasClosed: boolean;
}

export const newsletterInitialState: NewsletterState = {
  emails: [],
  shouldShowNewsletterModal: true,
  newsletterModalWasClosed: false
};
