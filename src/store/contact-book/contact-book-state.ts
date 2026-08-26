import { Contact } from 'src/interfaces/contact.interface';

interface ContactStateInterface {
  tezosBalance: string;
}

export interface ContactBookState {
  contacts: Contact[];
  contactsStateRecord: Record<string, ContactStateInterface>;
  ignoredAddresses: Array<string>;
  contactCandidateAddress: string;
}
export const contactBookInitialState: ContactBookState = {
  contacts: [],
  contactsStateRecord: {},
  ignoredAddresses: [],
  contactCandidateAddress: ''
};
