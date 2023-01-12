import { createReducer } from '@reduxjs/toolkit';

import { addContactAction, deleteContactAction, editContactAction } from './contacts-actions';
import { contactsInitialState, ContactsState } from './contacts-state';

export const contactsReducers = createReducer<ContactsState>(contactsInitialState, builder => {
  builder.addCase(addContactAction, (state, { payload }) => {
    state.contacts.push(payload);
  });
  builder.addCase(editContactAction, (state, { payload }) => {
    const indexContactToEdit = state.contacts.findIndex(contact => contact.address === payload.address);

    if (indexContactToEdit !== -1) {
      state.contacts[indexContactToEdit] = payload;
    }
  });
  builder.addCase(deleteContactAction, (state, { payload }) => {
    state.contacts.filter(contact => contact.address !== payload.address);
  });
});
