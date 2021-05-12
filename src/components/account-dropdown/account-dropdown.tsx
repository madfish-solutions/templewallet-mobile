import React, { FC } from 'react';

import { AccountInterface } from '../../interfaces/account.interface';
import { Dropdown, DropdownValueProps } from '../dropdown/dropdown';
import { renderAccountListItem, renderAccountValue } from './account-dropdown-item/account-dropdown-item';

export const AccountDropdown: FC<DropdownValueProps<AccountInterface>> = ({ value, list, onValueChange }) => (
  <Dropdown
    title="Accounts"
    value={value}
    list={list}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
    onValueChange={onValueChange}
  />
);
