import { createReducer } from '@reduxjs/toolkit';

import {
  addBlacklistedContactAction,
  addContactAction,
  addContactCandidatePkhAction,
  deleteContactAction,
  editContactAction
} from './contacts-actions';
import { contactsInitialState, ContactsState } from './contacts-state';

export const contactsReducers = createReducer<ContactsState>(contactsInitialState, builder => {
  builder.addCase(addContactAction, (state, { payload }) => {
    state.contacts = [...state.contacts, payload];
  });
  builder.addCase(editContactAction, (state, { payload }) => {
    const contactIndex = state.contacts.findIndex(contact => contact.publicKeyHash === payload.publicKeyHash);

    if (contactIndex !== -1) {
      const contactsCopy = [...state.contacts];
      contactsCopy[contactIndex] = payload;
      state.contacts = contactsCopy;
    }
  });
  builder.addCase(deleteContactAction, (state, { payload }) => {
    state.contacts = state.contacts.filter(contact => contact.publicKeyHash !== payload.publicKeyHash);
  });
  builder.addCase(addContactCandidatePkhAction, (state, { payload }) => {
    state.contactCandidatePkh = payload;
  });
  builder.addCase(addBlacklistedContactAction, (state, { payload }) => {
    state.ignoredAddresses = [...state.ignoredAddresses, payload];
  });
});
