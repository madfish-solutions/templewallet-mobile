import React, { Fragment } from 'react';

import { Divider } from '../../../components/divider/divider';
import { useHdAccountsListSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { InfoText } from '../info-text/info-text';
import { ManageAccountItem } from '../manage-account-item/manage-account-item';

export const ManageHdAccounts = () => {
  const hdAccounts = useHdAccountsListSelector();

  return (
    <>
      <InfoText />

      {hdAccounts.map(account => (
        <Fragment key={account.publicKeyHash}>
          <ManageAccountItem account={account} />
          <Divider size={formatSize(16)} />
        </Fragment>
      ))}
    </>
  );
};
