import { createAction } from '@reduxjs/toolkit';

import { Contact } from './contacts-state';

export const addContactAction = createAction<Contact>('contacts/ADD_CONTACT');
export const editContactAction = createAction<Contact>('contacts/EDIT_CONTACT');
export const deleteContactAction = createAction<Contact>('contacts/DELETE_CONTACT');
