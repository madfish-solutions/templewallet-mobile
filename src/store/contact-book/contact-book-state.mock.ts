import { mockContact } from 'src/interfaces/account.interface.mock';

import { ContactBookState } from './contact-book-state';

export const mockContactBookState: ContactBookState = {
  contacts: [mockContact],
  contactsStateRecord: {},
  contactCandidateAddress: '',
  ignoredAddresses: ['']
};
