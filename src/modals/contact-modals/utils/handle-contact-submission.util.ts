import { NameResolver } from '@tezos-domains/resolver';
import { FormikProps } from 'formik/dist/types';
import { RefObject } from 'react';

import { Contact } from 'src/interfaces/contact.interface';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { isTezosDomainNameValid } from 'src/utils/dns.utils';
import { isValidAddress } from 'src/utils/tezos.util';

export const handleContactSubmission = async (
  contact: Contact,
  formik: RefObject<FormikProps<Contact> | null>,
  resolver: NameResolver,
  setIsLoading: (isLoading: boolean) => void,
  callback: (contact: Contact) => void
) => {
  if (isTezosDomainNameValid(contact.address)) {
    setIsLoading(true);

    const address = await resolver.resolveNameToAddress(contact.address).catch(() => null);
    setIsLoading(false);
    if (address !== null) {
      contact.address = address;
      await formik.current?.validateField('address');
    } else if (!isValidAddress(contact.address)) {
      showErrorToast({ title: 'Error!', description: 'Your address has been expired' });

      return;
    }
  }

  if (formik.current && formik.current.isValid) {
    callback(contact);
  }
};
