import React, { FC } from 'react';

import { EventFn } from '../../config/general';
import { FormSectionDropdown } from '../../form/form-section-dropdown';
import { AccountBaseInterface } from '../../interfaces/account.interface';
import { SectionDropdownDataInterface } from '../../interfaces/section-dropdown-data.interface';
import { DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameEnum } from '../icon/icon-name.enum';
import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { accountEqualityFn } from './account-equality-fn';

interface Props {
  name: string;
  list: Array<SectionDropdownDataInterface<AccountBaseInterface>>;
  setSearchValue: EventFn<string>;
}

const renderAccountValue: DropdownValueComponent<AccountBaseInterface> = ({ value }) => (
  <DropdownItemContainer>
    <AccountDropdownItem account={value} actionIconName={IconNameEnum.TriangleDown} />
  </DropdownItemContainer>
);

export const AccountFormSectionDropdown: FC<Props> = ({ name, list, setSearchValue }) => (
  <FormSectionDropdown
    isSearchable
    name={name}
    list={list}
    description="Accounts and contacts"
    setSearchValue={setSearchValue}
    equalityFn={accountEqualityFn}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
  />
);
