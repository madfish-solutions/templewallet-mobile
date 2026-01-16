import React, { FC } from 'react';

import { FormSectionDropdown } from 'src/form/form-section-dropdown';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { SectionDropdownDataInterface } from 'src/interfaces/section-dropdown-data.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameEnum } from '../icon/icon-name.enum';

import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { accountEqualityFn } from './account-equality-fn';

interface Props extends TestIdProps {
  name: string;
  list: Array<SectionDropdownDataInterface<AccountBaseInterface>>;
  setSearchValue: SyncFn<string>;
}

const renderAccountValue: DropdownValueComponent<AccountBaseInterface> = ({ value }) => (
  <DropdownItemContainer>
    <AccountDropdownItem account={value} actionIconName={IconNameEnum.TriangleDown} />
  </DropdownItemContainer>
);

export const AccountFormSectionDropdown: FC<Props> = ({ name, list, setSearchValue, testID, testIDProperties }) => (
  <FormSectionDropdown
    isSearchable
    name={name}
    list={list}
    description="Accounts and contacts"
    setSearchValue={setSearchValue}
    equalityFn={accountEqualityFn}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
    testID={testID}
    testIDProperties={testIDProperties}
  />
);
