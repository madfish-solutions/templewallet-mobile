import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { useContactsAddressesSelector } from '../../store/contacts/contacts-selectors';
import { Contact } from '../../store/contacts/contacts-state';
import { isDefined } from '../../utils/is-defined';
import { isValidAddress } from '../../utils/tezos.util';

export const useContactFormValidationSchema = (): SchemaOf<Contact> => {
  const contactsAddresses = useContactsAddressesSelector();

  return object().shape({
    name: string().required('Invalid name. It should be: 1-16 characters, without special symbols').min(1).max(16),
    address: string()
      .required(makeRequiredErrorMessage('Address'))
      .notOneOf(contactsAddresses, 'Contact with the same address already exists')
      .test('is-valid-address', 'Invalid address', value => (isDefined(value) ? isValidAddress(value) : false))
  });
};
