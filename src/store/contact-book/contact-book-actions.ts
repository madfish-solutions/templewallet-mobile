import { createAction } from '@reduxjs/toolkit';

import { Contact } from 'src/interfaces/contact.interface';

import { createActions } from '../create-actions';

export const addContactAction = createAction<Contact>('contactBook/ADD_CONTACT');
export const editContactAction = createAction<{ contact: Contact; index: number }>('contactBook/EDIT_CONTACT');
export const deleteContactAction = createAction<Contact>('contactBook/DELETE_CONTACT');
export const addContactCandidateAddressAction = createAction<string>('contactBook/ADD_CONTACT_CANDIDATE_ADDRESS');
export const addBlacklistedContactAction = createAction<string>('contactBook/ADD_BLACKLISTED_CONTACT');

export const loadContactTezosBalance = createActions<string, { address: string; tezosBalance: string }, string>(
  'contactBook/LOAD_CONTACT_TEZOS_BALANCE'
);
