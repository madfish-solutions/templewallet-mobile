import { createReducer } from '@reduxjs/toolkit';

import {
  addBlacklistedContactAction,
  addContactAction,
  addContactCandidateAddressAction,
  deleteContactAction,
  editContactAction
} from './contact-book-actions';
import { contactBookInitialState, ContactBookState } from './contact-book-state';

export const contactBookReducers = createReducer<ContactBookState>(contactBookInitialState, builder => {
  builder.addCase(addContactAction, (state, { payload }) => {
    state.contacts = [...state.contacts, payload];
  });
  builder.addCase(editContactAction, (state, { payload }) => {
    const contactsCopy = [...state.contacts];
    contactsCopy[payload.index] = payload.contact;
    state.contacts = contactsCopy;
  });
  builder.addCase(deleteContactAction, (state, { payload }) => {
    state.contacts = state.contacts.filter(contact => contact.publicKeyHash !== payload.publicKeyHash);
  });
  builder.addCase(addContactCandidateAddressAction, (state, { payload }) => {
    state.contactCandidateAddress = payload;
  });
  builder.addCase(addBlacklistedContactAction, (state, { payload }) => {
    state.ignoredAddresses = [...state.ignoredAddresses, payload];
  });
});
