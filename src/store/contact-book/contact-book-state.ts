import { AccountBaseInterface } from '../../interfaces/account.interface';

interface ContactStateInterface {
  tezosBalance: string;
}

export interface ContactBookState {
  contacts: Array<AccountBaseInterface>;
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
