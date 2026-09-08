import { Contact } from 'src/interfaces/contact.interface';

export interface ContactBookState {
  contacts: Contact[];
  ignoredAddresses: Array<string>;
  contactCandidateAddress: string;
  /** @deprecated */
  contactsStateRecord?: Record<string, object>;
}
export const contactBookInitialState: ContactBookState = {
  contacts: [],
  ignoredAddresses: [],
  contactCandidateAddress: ''
};
