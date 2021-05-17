import React, { FC } from 'react';

import { AccountInterface } from '../../interfaces/account.interface';
import { Dropdown, DropdownValueComponent, DropdownValueProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';

const renderAccountValue: DropdownValueComponent<AccountInterface> = ({ value }) => (
  <AccountDropdownItem account={value} showFullData={false} actionIconName={IconNameEnum.TriangleDown} />
);

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
