import { mockAccountBase } from '../../interfaces/account.interface.mock';
import { ContactsState } from './contacts-state';

export const mockContactsState: ContactsState = {
  contacts: [mockAccountBase],
  contactCandidatePkh: '',
  ignoredAddresses: ['']
};
