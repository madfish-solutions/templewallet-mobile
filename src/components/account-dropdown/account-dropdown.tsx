import React, { FC } from 'react';

import { AccountInterface } from '../../interfaces/account.interface';
import { Dropdown, DropdownValueProps } from '../dropdown/dropdown';
import { renderAccountListItem, renderAccountValue } from './account-dropdown-item/account-dropdown-item';

interface Props extends DropdownValueProps<AccountInterface> {
  list: AccountInterface[];
}

export const AccountDropdown: FC<Props> = ({ value, list, onValueChange }) => (
  <Dropdown
    title="Accounts"
    value={value}
    list={list}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
    onValueChange={onValueChange}
  />
);
