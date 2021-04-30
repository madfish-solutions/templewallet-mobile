import React, { FC } from 'react';
import { Text } from 'react-native';

import { FormDropdown } from '../../form/form-dropdown';
import { AccountInterface } from '../../interfaces/account.interface';
import { DropdownListItemComponent, DropdownValueComponent } from '../dropdown/dropdown';
import { AccountDropdownItem } from './account-dropdown-item/account-dropdown-item';

const renderValue: DropdownValueComponent<AccountInterface> = ({ value }) =>
  value === undefined ? <Text>Kekos</Text> : <AccountDropdownItem account={value} />;

const renderListItem: DropdownListItemComponent<AccountInterface> = ({ item }) => (
  <AccountDropdownItem account={item} />
);

interface Props {
  name: string;
  list: AccountInterface[];
}

export const AccountFormDropdown: FC<Props> = ({ name, list }) => (
  <FormDropdown name={name} title="Accounts" list={list} renderValue={renderValue} renderListItem={renderListItem} />
);
