import React, { FC } from 'react';

import { AccountInterface } from '../../interfaces/account.interface';
import { DropdownValueComponent, DropdownValueProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownBase } from './account-dropdown-base';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';

const renderAccountValue: DropdownValueComponent<AccountInterface> = ({ value }) => (
  <AccountDropdownItem account={value} showFullData={false} actionIconName={IconNameEnum.TriangleDown} />
);

export const CurrentAccountDropdown: FC<DropdownValueProps<AccountInterface>> = ({ value, list, onValueChange }) => (
  <AccountDropdownBase
    value={value}
    list={list}
    renderValue={renderAccountValue}
    renderAccountListItem={renderAccountListItem}
    onValueChange={onValueChange}
  />
);
