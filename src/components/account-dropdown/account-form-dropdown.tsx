import React, { FC } from 'react';

import { FormDropdown } from 'src/form/form-dropdown';
import { Account } from 'src/interfaces/account.interfaces.ts';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum';

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

export const AccountFormDropdown: FC<Props> = ({ name, list, testID, testIDProperties }) => (
  <FormDropdown
    name={name}
    description="Accounts"
    list={list}
    equalityFn={accountEqualityFn}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
    testID={testID}
    testIDProperties={testIDProperties}
  />
);
