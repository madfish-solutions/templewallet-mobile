import { Contact } from 'src/interfaces/contact.interface';

export interface ContactBookState {
  contacts: Contact[];
  ignoredAddresses: Array<string>;
  contactCandidateAddress: string;
}
export const contactBookInitialState: ContactBookState = {
  contacts: [],
  ignoredAddresses: [],
  contactCandidateAddress: ''
};
