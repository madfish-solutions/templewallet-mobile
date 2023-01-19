import { createAction } from '@reduxjs/toolkit';

import { IAccountBase } from '../../interfaces/account.interface';

export const addContactAction = createAction<IAccountBase>('contacts/ADD_CONTACT');
export const editContactAction = createAction<IAccountBase>('contacts/EDIT_CONTACT');
export const deleteContactAction = createAction<IAccountBase>('contacts/DELETE_CONTACT');
export const addContactRequestAction = createAction<string>('contacts/ADD_CONTACT_REQUEST');
export const addBlacklistedContactAction = createAction<string>('contacts/ADD_BLACKLISTED_CONTACT');
