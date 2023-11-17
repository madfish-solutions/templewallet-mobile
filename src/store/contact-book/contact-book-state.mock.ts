import { mockAccountBase } from '../../interfaces/account.interface.mock';

import { ContactBookState } from './contact-book-state';

export const mockContactBookState: ContactBookState = {
  contacts: [mockAccountBase],
  contactsStateRecord: {},
  contactCandidateAddress: '',
  ignoredAddresses: ['']
};
