import { useSelector } from '../selector';

export const useContactsSelector = () => useSelector(state => state.contacts.contacts);
export const useContactsAddressesSelector = () =>
  useSelector(state => state.contacts.contacts.map(({ address }) => address));
