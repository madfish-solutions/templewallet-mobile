import { useMemo } from 'react';

import { useSelector } from '../selector';

export const useContactsSelector = () => useSelector(state => state.contactBook.contacts);
export const useContactsAddresses = () => {
  const contacts = useContactsSelector();

  return useMemo(() => contacts.map(({ publicKeyHash }) => publicKeyHash), [contacts]);
};
export const useContactsNames = () => {
  const contacts = useContactsSelector();

  return useMemo(() => contacts.map(({ name }) => name), [contacts]);
};
export const useContactCandidateAddressSelector = () => useSelector(state => state.contactBook.contactCandidateAddress);
export const useIgnoredAddressesSelector = () => useSelector(state => state.contactBook.ignoredAddresses);
