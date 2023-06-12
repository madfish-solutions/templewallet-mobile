import { createReducer } from '@reduxjs/toolkit';

import { addNewsletterEmailAction } from './newsletter-actions';
import { NewsletterState, newsletterInitialState } from './newsletter-state';

export const newsletterReducers = createReducer<NewsletterState>(newsletterInitialState, builer => {
  builer.addCase(addNewsletterEmailAction, (state, { payload }) => ({
    emails: [...state.emails, payload]
  }));
});
