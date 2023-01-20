import { AccountBaseInterface } from '../../interfaces/account.interface';

export interface ContactsState {
  contacts: Array<AccountBaseInterface>;
  ignoredAddresses: Array<string>;
  contactCandidatePkh: string;
}
export const contactsInitialState: ContactsState = {
  contacts: [],
  ignoredAddresses: [],
  contactCandidatePkh: ''
};

export interface ContactsBookRootState {
  contactBook: ContactsState;
}
