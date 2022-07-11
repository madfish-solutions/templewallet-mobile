import React, { FC } from 'react';

import { AccountInterface } from '../../interfaces/account.interface';
import { DropdownValueComponent, DropdownValueProps } from '../dropdown/dropdown';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownBase } from './account-dropdown-base';
import { renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { AccountDropdownModalItem } from './account-dropdown-item/account-dropdown-item-modal';

const renderAccountValueWithModal: DropdownValueComponent<AccountInterface> = ({ value }) => (
  <AccountDropdownModalItem account={value} showFullData={false} actionIconName={IconNameEnum.TriangleDown} />
);

export const ModalAccountDropdown: FC<DropdownValueProps<AccountInterface>> = ({ value, list, onValueChange }) => {
  return (
    <AccountDropdownBase
      value={value}
      list={list}
      renderValue={renderAccountValueWithModal}
      renderAccountListItem={renderAccountListItem}
      onValueChange={onValueChange}
    />
  );
};
