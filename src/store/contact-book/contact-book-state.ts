import { AccountBaseInterface } from '../../interfaces/account.interface';

export interface ContactBookState {
  contacts: Array<AccountBaseInterface>;
  ignoredAddresses: Array<string>;
  contactCandidateAddress: string;
}
export const contactBookInitialState: ContactBookState = {
  contacts: [],
  ignoredAddresses: [],
  contactCandidateAddress: ''
};

export interface ContactsBookRootState {
  contactBook: ContactBookState;
}
