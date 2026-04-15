import { NameResolver } from '@tezos-domains/resolver';
import { FormikProps } from 'formik/dist/types';
import { RefObject } from 'react';

import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { isTezosDomainNameValid } from 'src/utils/dns.utils';
import { isValidAddress } from 'src/utils/tezos.util';

export const handleContactSubmission = async (
  contact: AccountBaseInterface,
  formik: RefObject<FormikProps<AccountBaseInterface> | null>,
  resolver: NameResolver,
  setIsLoading: (isLoading: boolean) => void,
  callback: (contact: AccountBaseInterface) => void
) => {
  if (isTezosDomainNameValid(contact.publicKeyHash)) {
    setIsLoading(true);

    const address = await resolver.resolveNameToAddress(contact.publicKeyHash).catch(() => null);
    setIsLoading(false);
    if (address !== null) {
      contact.publicKeyHash = address;
      await formik.current?.validateField('publicKeyHash');
    } else if (!isValidAddress(contact.publicKeyHash)) {
      showErrorToast({ title: 'Error!', description: 'Your address has been expired' });

      return;
    }
  }

  if (formik.current && formik.current.isValid) {
    callback(contact);
  }
};
