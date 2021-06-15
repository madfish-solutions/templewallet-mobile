import React, { FC } from 'react';

import { FormDropdown } from '../../form/form-dropdown';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { accountEqualityFn } from './account-equality-fn';

interface Props {
  name: string;
  list: WalletAccountInterface[];
}

const renderAccountValue: DropdownValueComponent<WalletAccountInterface> = ({ value }) => (
  <DropdownItemContainer>
    <AccountDropdownItem account={value} actionIconName={IconNameEnum.TriangleDown} />
  </DropdownItemContainer>
);

export const AccountFormDropdown: FC<Props> = ({ name, list }) => (
  <FormDropdown
    name={name}
    title="Accounts"
    list={list}
    equalityFn={accountEqualityFn}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
  />
);
