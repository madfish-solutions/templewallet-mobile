import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../form/validation/messages';
import { AccountBaseInterface } from '../../interfaces/account.interface';
import {
  useContactsAddressesSelector,
  useContactsNamesSelector
} from '../../store/contact-book/contact-book-selectors';
import { isDefined } from '../../utils/is-defined';
import { isValidAddress } from '../../utils/tezos.util';

export const useAddContactFormValidationSchema = (): SchemaOf<AccountBaseInterface> => {
  const contactsAddresses = useContactsAddressesSelector();
  const contactsNames = useContactsNamesSelector();

  return object().shape({
    name: string()
      .required('Invalid name. It should be: 1-16 characters, without special symbols')
      .notOneOf(contactsNames, 'Contact with the same names already exists')
      .min(1)
      .max(16),
    publicKeyHash: string()
      .required(makeRequiredErrorMessage('Address'))
      .notOneOf(contactsAddresses, 'Contact with the same address already exists')
      .test('is-valid-address', 'Invalid address', value => (isDefined(value) ? isValidAddress(value) : false))
  });
};

export const editContactFormValidationSchema = object().shape({
  name: string().required('Invalid name. It should be: 1-16 characters, without special symbols').min(1).max(16),
  publicKeyHash: string()
    .required(makeRequiredErrorMessage('Address'))
    .test('is-valid-address', 'Invalid address', value => (isDefined(value) ? isValidAddress(value) : false))
});
