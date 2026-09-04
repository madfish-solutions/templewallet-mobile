import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors';

import {
  AccountAddressDetails,
  AccountAddressDetailsParams,
  getAccountAddressDetails
} from './account-address-details.utils';

export const useAccountAddressDetails = ({
  account,
  ...params
}: Omit<AccountAddressDetailsParams, 'saplingAddress'>): AccountAddressDetails[] => {
  const saplingAddress = useSaplingAddressForAccount(account);

  return getAccountAddressDetails({ ...params, account, saplingAddress });
};
