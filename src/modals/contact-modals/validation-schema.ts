import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { AccountBaseInterface } from '../../interfaces/account.interface';
import {
  useContactsAddressesSelector,
  useContactsNamesSelector
} from '../../store/contact-book/contact-book-selectors';
import { useAccountsListSelector } from '../../store/wallet/wallet-selectors';
import { isTezosDomainNameValid } from '../../utils/dns.utils';
import { isDefined } from '../../utils/is-defined';
import { isValidAddress } from '../../utils/tezos.util';

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
    publicKeyHash: string()
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

export const useAddContactFormValidationSchema = (): SchemaOf<AccountBaseInterface> => {
  const ownAccounts = useAccountsListSelector().map(({ publicKeyHash }) => publicKeyHash);
  const contactsNames = useContactsNamesSelector();
  const contactsAddresses = useContactsAddressesSelector();

  return baseValidationSchema({ contactsNames, contactsAddresses, ownAccounts });
};

export const useEditContactFormValidationSchema = (editContactIndex: number): SchemaOf<AccountBaseInterface> => {
  const ownAccounts = useAccountsListSelector().map(({ publicKeyHash }) => publicKeyHash);
  const contactsNames = useContactsNamesSelector().filter((_, index) => editContactIndex !== index);
  const contactsAddresses = useContactsAddressesSelector().filter((_, index) => editContactIndex !== index);

  return baseValidationSchema({ contactsNames, contactsAddresses, ownAccounts });
};
