import { createAction } from '@reduxjs/toolkit';

import { AccountBaseInterface } from '../../interfaces/account.interface';
import { createActions } from '../create-actions';

export const addContactAction = createAction<AccountBaseInterface>('contactBook/ADD_CONTACT');
export const editContactAction = createAction<{ contact: AccountBaseInterface; index: number }>(
  'contactBook/EDIT_CONTACT'
);
export const deleteContactAction = createAction<AccountBaseInterface>('contactBook/DELETE_CONTACT');
export const addContactCandidateAddressAction = createAction<string>('contactBook/ADD_CONTACT_CANDIDATE_ADDRESS');
export const addBlacklistedContactAction = createAction<string>('contactBook/ADD_BLACKLISTED_CONTACT');

export const loadContactTezosBalance = createActions<string, { publicKeyHash: string; tezosBalance: string }, string>(
  'contactBook/LOAD_CONTACT_TEZOS_BALANCE'
);
