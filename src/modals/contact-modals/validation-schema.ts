import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { Contact } from 'src/interfaces/contact.interface';
import { useContactsAddresses, useContactsNames } from 'src/store/contact-book/contact-book-selectors';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { getAccountAddressForTezos } from 'src/utils/account.utils';
import { isTezosDomainNameValid } from 'src/utils/dns.utils';
import { isDefined } from 'src/utils/is-defined';
import { isValidAddress } from 'src/utils/tezos.util';

const baseValidationSchema = ({
  contactsNames,
  contactsAddresses,
  ownAccounts
}: {
  contactsNames: Array<string>;
  contactsAddresses: Array<string>;
  ownAccounts: Array<string>;
}) =>
  object().shape({
    name: string()
      .required('Invalid name. It should be: 1-16 characters')
      .notOneOf(contactsNames, 'Contact with the same name already exists')
      .max(16, 'The contact name must be at most 16 characters')
      .test('whitespaces', 'The contact name cannot include leading and trailing spaces', value =>
        isDefined(value) ? value === value.trim() : false
      ),
    address: string()
      .required(makeRequiredErrorMessage('Address'))
      .notOneOf(contactsAddresses, 'Contact with the same address already exists')
      .test('is-valid-address', 'Invalid address', value =>
        isDefined(value) ? isValidAddress(value) || isTezosDomainNameValid(value) : false
      )
      .test(
        'is-own-account',
        'Your account cannot be added to contacts',
        value => isDefined(value) && !ownAccounts.includes(value)
      )
  });

export const useAddContactFormValidationSchema = (): SchemaOf<Contact> => {
  const ownAccounts = useAllAccounts().map(getAccountAddressForTezos).filter(isDefined);
  const contactsNames = useContactsNames();
  const contactsAddresses = useContactsAddresses();

  return baseValidationSchema({ contactsNames, contactsAddresses, ownAccounts });
};

export const useEditContactFormValidationSchema = (editContactIndex: number): SchemaOf<Contact> => {
  const ownAccounts = useAllAccounts().map(getAccountAddressForTezos).filter(isDefined);
  const contactsNames = useContactsNames().filter((_, index) => editContactIndex !== index);
  const contactsAddresses = useContactsAddresses().filter((_, index) => editContactIndex !== index);

  return baseValidationSchema({ contactsNames, contactsAddresses, ownAccounts });
};
