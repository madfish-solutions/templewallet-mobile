import { IAccountBase } from '../../interfaces/account.interface';

export interface ContactsState {
  contacts: Array<IAccountBase>;
}
export const contactsInitialState: ContactsState = {
  contacts: []
};

export interface ContactsRootState {
  contacts: ContactsState;
}
