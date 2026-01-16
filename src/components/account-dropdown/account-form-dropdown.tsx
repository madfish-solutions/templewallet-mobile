import React, { FC } from 'react';

import { FormDropdown } from 'src/form/form-dropdown';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';

import { DropdownValueComponent } from '../dropdown/dropdown';
import { DropdownItemContainer } from '../dropdown/dropdown-item-container/dropdown-item-container';
import { IconNameEnum } from '../icon/icon-name.enum';

import { AccountDropdownItem, renderAccountListItem } from './account-dropdown-item/account-dropdown-item';
import { accountEqualityFn } from './account-equality-fn';

interface Props extends TestIdProps {
  name: string;
  list: AccountBaseInterface[];
}

const renderAccountValue: DropdownValueComponent<AccountBaseInterface> = ({ value }) => (
  <DropdownItemContainer>
    <AccountDropdownItem account={value} actionIconName={IconNameEnum.TriangleDown} />
  </DropdownItemContainer>
);

export const AccountFormDropdown: FC<Props> = ({ name, list, testID, testIDProperties }) => (
  <FormDropdown
    name={name}
    description="Accounts"
    list={list}
    equalityFn={accountEqualityFn}
    renderValue={renderAccountValue}
    renderListItem={renderAccountListItem}
    testID={testID}
    testIDProperties={testIDProperties}
  />
);
