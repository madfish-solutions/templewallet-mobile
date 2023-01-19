import { IAccountBase } from '../../interfaces/account.interface';

export interface ContactsState {
  contacts: Array<IAccountBase>;
  blacklistedAddresses: Array<string>;
  addContactRequest: string;
}
export const contactsInitialState: ContactsState = {
  contacts: [],
  blacklistedAddresses: [],
  addContactRequest: ''
};

export interface ContactsRootState {
  contacts: ContactsState;
}
