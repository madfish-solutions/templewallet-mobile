export interface Contact {
  name: string;
  address: string;
}
export interface ContactsState {
  contacts: Array<Contact>;
}
export const contactsInitialState: ContactsState = {
  contacts: []
};

export interface ContactsRootState {
  contacts: ContactsState;
}
