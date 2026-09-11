import { useField } from 'formik';
import React, { FC, useCallback } from 'react';

import { AccountCard } from 'src/components/account-card';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { ErrorMessage } from 'src/form/error-message/error-message';
import { Account } from 'src/interfaces/account.interfaces.ts';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { isDefined } from 'src/utils/is-defined';

import { DropdownListItemComponent } from '../dropdown/dropdown';

import { AccountDropdownBase, AccountDropdownValueComponent } from './account-dropdown-base';
import { AccountDropdownListItem } from './account-dropdown-item/account-dropdown-item';

interface Props extends TestIdProps {
  name: string;
  list: Account[];
  chainKind?: TempleChainKind;
}

export const AccountCardFormDropdown: FC<Props> = ({ name, list, chainKind, testID, testIDProperties }) => {
  const [field, meta, helpers] = useField<Account>(name);
  const handleValueChange = (account: Account) => void helpers.setValue(account);

  const renderAccountCardValue = useCallback<AccountDropdownValueComponent>(
    ({ value }) => (
      <AccountCard account={value} showAllAddresses={!isDefined(chainKind)} showDropdownDown chainKind={chainKind} />
    ),
    [chainKind]
  );

  const renderAccountListItem = useCallback<DropdownListItemComponent<Account>>(
    ({ item }) => (
      <AccountDropdownListItem account={item} showAllAddresses={!isDefined(chainKind)} chainKind={chainKind} />
    ),
    [chainKind]
  );

  return (
    <>
      <AccountDropdownBase
        value={field.value}
        list={list}
        renderValue={renderAccountCardValue}
        renderAccountListItem={renderAccountListItem}
        onValueChange={handleValueChange}
        testID={testID}
        testIDProperties={testIDProperties}
      />
      <ErrorMessage meta={meta} />
    </>
  );
};
