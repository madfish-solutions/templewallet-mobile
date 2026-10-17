import { createReducer } from '@reduxjs/toolkit';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';

import { addNewsletterEmailAction, shouldShowNewsletterModalAction } from './newsletter-actions';
import { NewsletterState, newsletterInitialState } from './newsletter-state';

const withNewsletterModalClosed = (state: NewsletterState, shouldShowNewsletterModal: boolean) =>
  state.newsletterModalWasClosed || (state.shouldShowNewsletterModal && !shouldShowNewsletterModal);

export const newsletterReducers = createReducer<NewsletterState>(newsletterInitialState, builder => {
  builder.addCase(addNewsletterEmailAction, (state, { payload }) => ({
    shouldShowNewsletterModal: false,
    newsletterModalWasClosed: withNewsletterModalClosed(state, false),
    emails: [...state.emails, payload]
  }));
  builder.addCase(shouldShowNewsletterModalAction, (state, { payload: shouldShowNewsletterModal }) => ({
    ...state,
    shouldShowNewsletterModal,
    newsletterModalWasClosed: withNewsletterModalClosed(state, shouldShowNewsletterModal)
  }));
  builder.addCase(setOnRampOverlayStateAction, (state, { payload: onRampOverlayState }) => {
    if (onRampOverlayState === OnRampOverlayState.Closed) {
      state.newsletterModalWasClosed = false;
    }
  });
});
