import React, { FC } from 'react';

import { TestIdProps } from 'src/interfaces/test-id.props';

import { FormDropdown } from '../../form/form-dropdown';
import { AccountBaseInterface } from '../../interfaces/account.interface';
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
