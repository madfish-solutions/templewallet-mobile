import React, { FC } from 'react';

import { FormSectionDropdown } from '../../form/form-section-dropdown';
import { IAccountBase } from '../../interfaces/account.interface';
import { DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { accountEqualityFn } from './account-equality-fn';

interface Props {
  name: string;
  list: Array<{ title: string; data: Array<IAccountBase> }>;
}

const renderAccountValue: DropdownValueComponent<IAccountBase> = ({ value }) => (
  <DropdownItemContainer>
    <AccountDropdownItem account={value} actionIconName={IconNameEnum.TriangleDown} />
  </DropdownItemContainer>
);

export const AccountFormSectionDropdown: FC<Props> = ({ name, list }) => (
  <FormSectionDropdown
    isSearchable
    name={name}
    list={list}
    description="Accounts and contacts"
    equalityFn={accountEqualityFn}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
  />
);
