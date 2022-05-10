import React, { FC } from 'react';

import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { DropdownValueComponent, DropdownValueProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownBase } from './account-dropdown-base';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';

const renderAccountValue: DropdownValueComponent<WalletAccountInterface> = ({ value }) => (
  <AccountDropdownItem account={value} showFullData={false} actionIconName={IconNameEnum.TriangleDown} />
);

export const CurrentAccountDropdown: FC<DropdownValueProps<WalletAccountInterface>> = ({
  value,
  list,
  onValueChange
}) => (
  <AccountDropdownBase
    value={value}
    list={list}
    renderValue={renderAccountValue}
    renderAccountListItem={renderAccountListItem}
    onValueChange={onValueChange}
  />
);
