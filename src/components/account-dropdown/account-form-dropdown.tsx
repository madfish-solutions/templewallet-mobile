import { useField } from 'formik';
import React, { FC } from 'react';

import { AccountCard } from 'src/components/account-card';
import { ErrorMessage } from 'src/form/error-message/error-message';
import { FormDropdown } from 'src/form/form-dropdown';
import { Account } from 'src/interfaces/account.interfaces.ts';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum';

import { AccountDropdownBase, AccountDropdownValueComponent } from './account-dropdown-base';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { accountEqualityFn } from './account-equality-fn';

interface Props extends TestIdProps {
  name: string;
  list: Account[];
}

const renderAccountValue: DropdownValueComponent<Account> = ({ value }) => (
  <DropdownItemContainer>
    {value && <AccountDropdownItem account={value} actionIconName={IconNameV2Enum.DropdownDown} />}
  </DropdownItemContainer>
);

const renderAccountCardValue: AccountDropdownValueComponent = ({ value }) => (
  <AccountCard account={value} showAllAddresses showDropdownDown />
);

export const AccountCardFormDropdown: FC<Props> = ({ name, list, testID, testIDProperties }) => {
  const [field, meta, helpers] = useField<Account>(name);
  const handleValueChange = (account: Account) => void helpers.setValue(account);

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

export const AccountFormDropdown: FC<Props> = props => (
  <FormDropdown
    {...props}
    description="Accounts"
    equalityFn={accountEqualityFn}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
  />
);
