import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';

import { addNewsletterEmailAction, shouldShowNewsletterModalAction } from './newsletter-actions';
import { newsletterReducers } from './newsletter-reducers';
import { newsletterInitialState } from './newsletter-state';

it('records the newsletter modal closing so the on-ramp overlay can open later', () => {
  const state = newsletterReducers(newsletterInitialState, shouldShowNewsletterModalAction(false));

  expect(state.shouldShowNewsletterModal).toBe(false);
  expect(state.newsletterModalWasClosed).toBe(true);
});

it('keeps the closed flag when the modal is already hidden', () => {
  const closedState = newsletterReducers(newsletterInitialState, shouldShowNewsletterModalAction(false));
  const state = newsletterReducers(closedState, shouldShowNewsletterModalAction(false));

  expect(state.newsletterModalWasClosed).toBe(true);
});

it('records a subscription as the newsletter modal closing', () => {
  const state = newsletterReducers(newsletterInitialState, addNewsletterEmailAction('user@example.com'));

  expect(state).toMatchObject({
    shouldShowNewsletterModal: false,
    newsletterModalWasClosed: true,
    emails: ['user@example.com']
  });
});

it('resets the closed flag when the on-ramp overlay is dismissed', () => {
  const closedState = newsletterReducers(newsletterInitialState, shouldShowNewsletterModalAction(false));
  const state = newsletterReducers(closedState, setOnRampOverlayStateAction(OnRampOverlayState.Closed));

  expect(state.newsletterModalWasClosed).toBe(false);
  expect(state.shouldShowNewsletterModal).toBe(false);
});

it('keeps the closed flag while the on-ramp overlay is opening', () => {
  const closedState = newsletterReducers(newsletterInitialState, shouldShowNewsletterModalAction(false));
  const state = newsletterReducers(closedState, setOnRampOverlayStateAction(OnRampOverlayState.Start));

  expect(state.newsletterModalWasClosed).toBe(true);
});
