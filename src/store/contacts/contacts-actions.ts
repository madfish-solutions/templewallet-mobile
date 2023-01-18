import { createAction } from '@reduxjs/toolkit';

import { IAccountBase } from '../../interfaces/account.interface';

export const addContactAction = createAction<IAccountBase>('contacts/ADD_CONTACT');
export const editContactAction = createAction<IAccountBase>('contacts/EDIT_CONTACT');
export const deleteContactAction = createAction<IAccountBase>('contacts/DELETE_CONTACT');
