import { createReducer } from '@reduxjs/toolkit';

import {
  addBlacklistedContactAction,
  addContactAction,
  addContactRequestAction,
  deleteContactAction,
  editContactAction
} from './contacts-actions';
import { contactsInitialState, ContactsState } from './contacts-state';

export const contactsReducers = createReducer<ContactsState>(contactsInitialState, builder => {
  builder.addCase(addContactAction, (state, { payload }) => {
    state.contacts.push(payload);
  });
  builder.addCase(editContactAction, (state, { payload }) => {
    const indexContactToEdit = state.contacts.findIndex(contact => contact.publicKeyHash === payload.publicKeyHash);

    if (indexContactToEdit !== -1) {
      state.contacts[indexContactToEdit] = payload;
    }
  });
  builder.addCase(deleteContactAction, (state, { payload }) => {
    state.contacts = state.contacts.filter(contact => contact.publicKeyHash !== payload.publicKeyHash);
  });
  builder.addCase(addContactRequestAction, (state, { payload }) => {
    state.addContactRequest = payload;
  });
  builder.addCase(addBlacklistedContactAction, (state, { payload }) => {
    state.blacklistedAddresses.push(payload);
  });
});
