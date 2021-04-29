import React, { FC } from 'react';
import { Text } from 'react-native';

import { AccountInterface } from '../../interfaces/account.interface';
import { Dropdown, DropdownListItemComponent, DropdownProps, DropdownValueComponent } from '../dropdown/dropdown';
import { AccountDropdownItem } from './account-dropdown-item/account-dropdown-item';

const renderValue: DropdownValueComponent<AccountInterface> = ({ value }) =>
  value === undefined ? <Text>Kekos</Text> : <AccountDropdownItem account={value} />;

const renderListItem: DropdownListItemComponent<AccountInterface> = ({ item }) => (
  <AccountDropdownItem account={item} />
);

export const AccountDropdown: FC<DropdownProps<AccountInterface>> = ({ value, list, onValueChange }) => (
  <Dropdown
    title="Accounts"
    value={value}
    list={list}
    onValueChange={onValueChange}
    renderValue={renderValue}
    renderListItem={renderListItem}
  />
);
