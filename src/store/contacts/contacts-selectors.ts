import { useSelector } from '../selector';

export const useContactsSelector = () => useSelector(state => state.contacts.contacts);
export const useContactsAddressesSelector = () =>
  useSelector(state => state.contacts.contacts.map(({ publicKeyHash }) => publicKeyHash));
export const useAddContactActionSelector = () => useSelector(state => state.contacts.addContactRequest);
export const useBlacklistedAddressesSelector = () => useSelector(state => state.contacts.blacklistedAddresses);
